package com.collabris.controller;

import com.collabris.dto.request.VerifyEmailRequest; 
import com.collabris.dto.request.LoginRequest;
import com.collabris.dto.request.ResetPasswordConfirmRequest;
import com.collabris.dto.request.ResetPasswordRequest;
import com.collabris.dto.request.SignupRequest;
import com.collabris.dto.response.JwtResponse;
import com.collabris.dto.response.MessageResponse;
import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.entity.VerificationToken;
import com.collabris.repository.RoleRepository;
import com.collabris.repository.UserRepository;
import com.collabris.security.jwt.JwtUtils;
import com.collabris.security.services.UserPrinciple;
import com.collabris.service.EmailService;
import com.collabris.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
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

    // ... (signin and signup methods are correct from previous step)

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserPrinciple userDetails = (UserPrinciple) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication. This should not happen."));
        if (!user.isEnabled()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Please verify your email before logging in."));
        }
        return ResponseEntity.ok(new JwtResponse(jwt, user));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setEnabled(false);
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(Role.ERole.MEMBER)
                    .orElseThrow(() -> new RuntimeException("Error: Role 'MEMBER' is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.ERole.ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role 'ADMIN' is not found."));
                        roles.add(adminRole);
                        break;
                    case "manager":
                        Role modRole = roleRepository.findByName(Role.ERole.MANAGER)
                                .orElseThrow(() -> new RuntimeException("Error: Role 'MANAGER' is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(Role.ERole.MEMBER)
                                .orElseThrow(() -> new RuntimeException("Error: Role 'MEMBER' is not found."));
                        roles.add(userRole);
                        break;
                }
            });
        }
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        VerificationToken token = tokenService.createVerificationToken(savedUser, VerificationToken.TokenType.EMAIL_VERIFICATION);
        emailService.sendEmail(savedUser.getEmail(), "Verify Your Collabris Account", "templates/email-verification.html",
                Map.of("firstName", savedUser.getFirstName(), "verificationCode", token.getCode()));
        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please verify your email."));
    }

    // --- THIS IS THE FIX ---
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        // The method now correctly accepts a request body with a "code" field.
        String tokenCode = request.getCode();
        
        Optional<VerificationToken> tokenOpt = tokenService.findValidToken(tokenCode, VerificationToken.TokenType.EMAIL_VERIFICATION);
        
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired token."));
        }

        VerificationToken verificationToken = tokenOpt.get();
        User user = verificationToken.getUser();

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Account is already verified."));
        }

        user.setEnabled(true);
        userRepository.save(user);
        tokenService.consumeToken(verificationToken);

        return ResponseEntity.ok(new MessageResponse("Email verified successfully! You can now log in."));
    }

    // ... (password reset methods are correct from previous step)
    @PostMapping("/reset-password-request")
    public ResponseEntity<?> resetPasswordRequest(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with that email."));
        VerificationToken token = tokenService.createVerificationToken(user, VerificationToken.TokenType.PASSWORD_RESET);
        emailService.sendEmail(user.getEmail(), "Collabris Password Reset", "templates/password-reset.html",
                Map.of("firstName", user.getFirstName(), "verificationCode", token.getCode()));
        return ResponseEntity.ok(new MessageResponse("Password reset email sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordConfirmRequest request) {
        Optional<VerificationToken> tokenOpt = tokenService.findValidToken(request.getToken(), VerificationToken.TokenType.PASSWORD_RESET);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired token."));
        }
        VerificationToken verificationToken = tokenOpt.get();
        User user = verificationToken.getUser();
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        tokenService.consumeToken(verificationToken);
        return ResponseEntity.ok(new MessageResponse("Password reset successful!"));
    }
}