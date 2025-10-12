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
import java.util.Optional;
import java.util.Set;

@Component
@Order(2)
public class AdminUserInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String ADMIN_USERNAME = "Elissa";
    private static final String ADMIN_EMAIL = "sibomanaelissa71@gmail.com";
    private static final String ADMIN_PASSWORD = "Admin@2025";
    private static final String ADMIN_FIRST_NAME = "Elissa";
    private static final String ADMIN_LAST_NAME = "Sibomana";

    @Override
    public void run(String... args) {
        try {
            createAdminUser();
        } catch (Exception e) {
            logger.error("❌ Error occurred while creating admin user: {}", e.getMessage(), e);
        }
    }

    private void createAdminUser() {
        if (userRepository.existsByUsername(ADMIN_USERNAME)) {
            logger.info("⚠️  Admin user '{}' already exists. Skipping creation.", ADMIN_USERNAME);
            return;
        }

        Optional<Role> adminRoleOpt = roleRepository.findByName(Role.ERole.ADMIN);
        if (adminRoleOpt.isEmpty()) {
            logger.error("🚨 FATAL: ADMIN role not found. Admin user cannot be created.");
            return;
        }

        User adminUser = new User(ADMIN_USERNAME, ADMIN_EMAIL, passwordEncoder.encode(ADMIN_PASSWORD));
        adminUser.setFirstName(ADMIN_FIRST_NAME);
        adminUser.setLastName(ADMIN_LAST_NAME);
        adminUser.setEnabled(true);

        Set<Role> roles = new HashSet<>();
        roles.add(adminRoleOpt.get());
        adminUser.setRoles(roles);

        userRepository.save(adminUser);

        logger.info("\n\n" +
                "============================================================\n" +
                "🎉  ADMIN ACCOUNT INITIALIZED SUCCESSFULLY\n" +
                "------------------------------------------------------------\n" +
                "👤 Username : {}\n" +
                "📧 Email    : {}\n" +
                "🔑 Password : {}\n" +
                "------------------------------------------------------------\n" +
                "⚡ You can now log in with this admin account.\n" +
                "============================================================\n",
                ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD);
    }
}
