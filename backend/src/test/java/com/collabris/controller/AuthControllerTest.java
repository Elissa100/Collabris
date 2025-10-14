package com.collabris.controller;

import com.collabris.dto.request.LoginRequest;
import com.collabris.dto.request.SignupRequest;
import com.collabris.dto.request.VerifyEmailRequest;
import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.entity.VerificationToken;
import com.collabris.repository.RoleRepository;
import com.collabris.repository.UserRepository;
import com.collabris.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        roleRepository.save(new Role(Role.ERole.MEMBER));
        roleRepository.save(new Role(Role.ERole.MANAGER));
        roleRepository.save(new Role(Role.ERole.ADMIN));
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void testSignup_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("testuser@example.com");
        signupRequest.setPassword("Password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully! Please verify your email."));
    }

    @Test
    void testSignup_UsernameAlreadyExists() throws Exception {
        User existingUser = new User("existinguser", "existing@example.com", "password");
        userRepository.save(existingUser);

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("existinguser");
        signupRequest.setEmail("newuser@example.com");
        signupRequest.setPassword("Password123");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Username is already taken!"));
    }

    @Test
    void testLogin_Success() throws Exception {
        User user = new User("loginuser", "loginuser@example.com", passwordEncoder.encode("Password123"));
        user.setFirstName("Login");
        user.setLastName("User");
        user.setEnabled(true);
        Role memberRole = roleRepository.findByName(Role.ERole.MEMBER).orElseThrow();
        user.setRoles(Set.of(memberRole));
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("loginuser");
        loginRequest.setPassword("Password123");

        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
    
    @Test
    void testVerifyEmail_Success() throws Exception {
        User unverifiedUser = new User("unverified", "unverified@example.com", "password");
        unverifiedUser.setEnabled(false);
        userRepository.save(unverifiedUser);

        VerificationToken token = tokenService.createVerificationToken(unverifiedUser, VerificationToken.TokenType.EMAIL_VERIFICATION);
        VerifyEmailRequest verifyRequest = new VerifyEmailRequest(token.getCode());

        mockMvc.perform(post("/api/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Email verified successfully! You can now log in."));

        Optional<User> verifiedUser = userRepository.findByUsername("unverified");
        assertTrue(verifiedUser.isPresent() && verifiedUser.get().isEnabled());
    }
}