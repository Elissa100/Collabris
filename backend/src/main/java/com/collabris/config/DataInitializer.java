// File Path: backend/src/main/java/com/collabris/config/DataInitializer.java
package com.collabris.config;

import com.collabris.entity.Role;
import com.collabris.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            // FIX: Using the correct, existing enum values with "ROLE_" prefix
            roleRepository.saveAll(List.of(
                new Role(Role.ERole.ROLE_ADMIN),
                new Role(Role.ERole.ROLE_MANAGER),
                new Role(Role.ERole.ROLE_MEMBER)
            ));
        }
    }
}