package com.collabris.controller;

import com.collabris.dto.request.LoginRequest;
import com.collabris.dto.request.SignupRequest;
import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.repository.RoleRepository;
import com.collabris.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles; // 1. IMPORT THIS
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@ActiveProfiles("test") // 2. ADD THIS ANNOTATION
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

    @BeforeEach
    void setUp() {
        // Since DataInitializer is disabled, we are starting with a 100% empty DB.
        // We must create all roles needed for the tests.
        roleRepository.save(new Role(Role.ERole.MEMBER));
        roleRepository.save(new Role(Role.ERole.MANAGER)); // Add if other tests need it
        roleRepository.save(new Role(Role.ERole.ADMIN));
    }

    @AfterEach
    void tearDown() {
        // Cleaning up is still good practice
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void testSignup() throws Exception {
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
    void testLogin() throws Exception {
        User user = new User();
        user.setUsername("loginuser");
        user.setEmail("loginuser@example.com");
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setFirstName("Login");
        user.setLastName("User");
        user.setEnabled(true);

        Role memberRole = roleRepository.findByName(Role.ERole.MEMBER)
                .orElseThrow(() -> new RuntimeException("MEMBER Role not found"));
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
}