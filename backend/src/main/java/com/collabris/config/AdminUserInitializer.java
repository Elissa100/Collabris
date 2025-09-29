package com.collabris.config;

import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.repository.RoleRepository;
import com.collabris.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@Order(2) // Run after DataInitializer (which has default order 1)
public class AdminUserInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Admin user credentials
    private static final String ADMIN_USERNAME = "Elissa";
    private static final String ADMIN_EMAIL = "sibomanaelissa71@gmail.com";
    private static final String ADMIN_PASSWORD = "Admin@2025";
    private static final String ADMIN_FIRST_NAME = "Elissa";
    private static final String ADMIN_LAST_NAME = "Sibomana";

    @Override
    public void run(String... args) throws Exception {
        try {
            createAdminUser();
        } catch (Exception e) {
            logger.error("Error occurred while creating admin user: {}", e.getMessage(), e);
        }
    }

    private void createAdminUser() {
        // Check if admin user already exists by username or email
        if (userRepository.existsByUsername(ADMIN_USERNAME)) {
            logger.info("Admin user with username '{}' already exists. Skipping creation.", ADMIN_USERNAME);
            return;
        }

        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            logger.info("Admin user with email '{}' already exists. Skipping creation.", ADMIN_EMAIL);
            return;
        }

        // Get admin role
        Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Admin Role is not found. Make sure DataInitializer runs first."));

        // Create admin user
        User adminUser = new User();
        adminUser.setUsername(ADMIN_USERNAME);
        adminUser.setEmail(ADMIN_EMAIL);
        adminUser.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
        adminUser.setFirstName(ADMIN_FIRST_NAME);
        adminUser.setLastName(ADMIN_LAST_NAME);
        adminUser.setEnabled(true);

        // Set admin role
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);
        adminUser.setRoles(roles);

        // Save admin user
        User savedAdmin = userRepository.save(adminUser);

        logger.info("=================================================");
        logger.info("ADMIN USER CREATED SUCCESSFULLY!");
        logger.info("=================================================");
        logger.info("Username: {}", savedAdmin.getUsername());
        logger.info("Email: {}", savedAdmin.getEmail());
        logger.info("Name: {} {}", savedAdmin.getFirstName(), savedAdmin.getLastName());
        logger.info("Role: ADMIN");
        logger.info("Password: {} (encoded)", ADMIN_PASSWORD);
        logger.info("User ID: {}", savedAdmin.getId());
        logger.info("Account Status: {}", savedAdmin.isEnabled() ? "ENABLED" : "DISABLED");
        logger.info("=================================================");
        logger.info("You can now login with these credentials:");
        logger.info("Email/Username: {} or {}", ADMIN_EMAIL, ADMIN_USERNAME);
        logger.info("Password: {}", ADMIN_PASSWORD);
        logger.info("=================================================");
    }
}