package com.collabris.controller;

import com.collabris.dto.request.*;
import com.collabris.dto.response.JwtResponse;
import com.collabris.dto.response.MessageResponse;
import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.entity.VerificationToken;
import com.collabris.repository.RoleRepository;
import com.collabris.repository.UserRepository;
import com.collabris.security.jwt.JwtUtils;
import com.collabris.security.services.UserPrinciple;
import com.collabris.service.TokenService;
import com.collabris.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // <--- THIS IS THE FIX
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    TokenService tokenService;
    
    @Autowired
    EmailService emailService;

    @PostMapping("/signin")
    @Operation(summary = "Sign in user", description = "Authenticate user and return JWT token")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Check if the user exists and if their account is enabled before authenticating
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getUsername()));

        if (userOptional.isPresent() && !userOptional.get().isEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: Please verify your email before logging in."));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrinciple userDetails = (UserPrinciple) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    @Operation(summary = "Register new user", description = "Register a new user account")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setEnabled(false); // Explicitly set to false

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_MEMBER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "manager":
                        Role modRole = roleRepository.findByName(Role.ERole.ROLE_MANAGER).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(Role.ERole.ROLE_MEMBER).orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        
        VerificationToken verificationToken = tokenService.createVerificationToken(savedUser, VerificationToken.TokenType.EMAIL_VERIFICATION);
        
        java.util.Map<String, String> emailVariables = new java.util.HashMap<>();
        emailVariables.put("firstName", savedUser.getFirstName());
        emailVariables.put("verificationCode", verificationToken.getCode());
        
        emailService.sendEmail(
            savedUser.getEmail(),
            "Verify Your Collabris Account",
            "templates/email-verification.html",
            emailVariables
        );
        
        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please check your email to verify your account."));
    }
    
    @PostMapping("/verify-email")
    @Operation(summary = "Verify email address", description = "Verify user's email address with verification code")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest verifyRequest) {
        Optional<VerificationToken> tokenOpt = tokenService.findValidToken(verifyRequest.getCode(), VerificationToken.TokenType.EMAIL_VERIFICATION);
        
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired verification code."));
        }
        
        VerificationToken token = tokenOpt.get();
        User user = token.getUser();
        
        user.setEnabled(true);
        userRepository.save(user);
        
        tokenService.consumeToken(token);
        
        return ResponseEntity.ok(new MessageResponse("Email verified successfully! You can now log in."));
    }
    
    @PostMapping("/resend-verification")
    @Operation(summary = "Resend verification email", description = "Resend verification email to user")
    public ResponseEntity<?> resendVerificationEmail(@Valid @RequestBody ForgotPasswordRequest resendRequest) {
        User user = userRepository.findByEmail(resendRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("No account found with this email address."));
        
        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body(new MessageResponse("This account is already verified."));
        }
        
        VerificationToken verificationToken = tokenService.createVerificationToken(user, VerificationToken.TokenType.EMAIL_VERIFICATION);
        
        java.util.Map<String, String> emailVariables = new java.util.HashMap<>();
        emailVariables.put("firstName", user.getFirstName());
        emailVariables.put("verificationCode", verificationToken.getCode());
        
        emailService.sendEmail(
            user.getEmail(),
            "Verify Your Collabris Account",
            "templates/email-verification.html",
            emailVariables
        );
        
        return ResponseEntity.ok(new MessageResponse("Verification email sent! Please check your email."));
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "Initiate password reset", description = "Send password reset code to user's email")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotRequest) {
        Optional<User> userOpt = userRepository.findByEmail(forgotRequest.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isEnabled()) {
                VerificationToken resetToken = tokenService.createVerificationToken(user, VerificationToken.TokenType.PASSWORD_RESET);
                java.util.Map<String, String> emailVariables = new java.util.HashMap<>();
                emailVariables.put("firstName", user.getFirstName());
                emailVariables.put("verificationCode", resetToken.getCode());
                emailService.sendEmail(user.getEmail(), "Reset Your Collabris Password", "templates/password-reset.html", emailVariables);
            }
        }
        
        return ResponseEntity.ok(new MessageResponse("If an account with this email exists, a password reset code will be sent."));
    }
    
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset user password using verified code")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetRequest) {
        Optional<VerificationToken> tokenOpt = tokenService.findLatestTokenByEmail(resetRequest.getEmail(), VerificationToken.TokenType.PASSWORD_RESET);
        
        if (tokenOpt.isEmpty() || !tokenOpt.get().getCode().equals(resetRequest.getCode()) || tokenOpt.get().isExpired() || tokenOpt.get().isUsed()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired reset code."));
        }
        
        VerificationToken token = tokenOpt.get();
        User user = token.getUser();
        
        user.setPassword(encoder.encode(resetRequest.getNewPassword()));
        userRepository.save(user);
        
        tokenService.consumeToken(token);
        
        return ResponseEntity.ok(new MessageResponse("Password reset successfully! You can now log in."));
    }
}