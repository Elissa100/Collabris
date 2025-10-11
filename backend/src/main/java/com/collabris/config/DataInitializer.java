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
            roleRepository.saveAll(List.of(
                new Role(Role.ERole.ADMIN),
                new Role(Role.ERole.MANAGER),
                new Role(Role.ERole.MEMBER)
            ));
        }
    }
}