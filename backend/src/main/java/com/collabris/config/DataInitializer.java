package com.collabris.config;

import com.collabris.entity.Role;
import com.collabris.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.findByName(Role.ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_ADMIN));
        }
        if (roleRepository.findByName(Role.ERole.ROLE_MANAGER).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_MANAGER));
        }
        if (roleRepository.findByName(Role.ERole.ROLE_MEMBER).isEmpty()) {
            roleRepository.save(new Role(Role.ERole.ROLE_MEMBER));
        }
    }
}