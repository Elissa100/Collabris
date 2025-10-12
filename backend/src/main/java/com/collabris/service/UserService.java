// File path: backend/src/main/java/com/collabris/service/UserService.java
package com.collabris.service;

import com.collabris.dto.request.AdminUserUpdateRequest;
import com.collabris.dto.response.UserResponse;
import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.repository.RoleRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public User saveUser(User user) {
        User savedUser = userRepository.save(user);
        broadcastUserStats(); // Send WebSocket update
        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserResponse getUserResponseByUsername(String username) {
        User user = findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return new UserResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponse::new).collect(Collectors.toList());
    }

    public User createUserByAdmin(AdminUserUpdateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = new User(request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(request.getEnabled() != null ? request.getEnabled() : true); // Default to enabled
        
        user.setRoles(getRolesFromStrings(request.getRoles()));
        
        return saveUser(user); // Use saveUser to trigger WebSocket event
    }

    public User updateUserByAdmin(Long userId, AdminUserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRoles() != null) {
            user.setRoles(getRolesFromStrings(request.getRoles()));
        }

        // We call the repository directly here since it's an update, not a new user.
        return userRepository.save(user);
    }

    public void deleteUserByAdmin(Long userId) {
        userRepository.deleteById(userId);
        broadcastUserStats(); // Send WebSocket update
    }

    // Helper method to convert role strings to Role entities
    private Set<Role> getRolesFromStrings(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(roleRepository.findByName(Role.ERole.MEMBER)
                .orElseThrow(() -> new RuntimeException("Error: Role MEMBER is not found.")));
        } else {
            strRoles.forEach(role -> {
                switch (role.toUpperCase()) {
                    case "ADMIN":
                        roles.add(roleRepository.findByName(Role.ERole.ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found.")));
                        break;
                    case "MANAGER":
                        roles.add(roleRepository.findByName(Role.ERole.MANAGER)
                            .orElseThrow(() -> new RuntimeException("Error: Role MANAGER is not found.")));
                        break;
                    default:
                        roles.add(roleRepository.findByName(Role.ERole.MEMBER)
                            .orElseThrow(() -> new RuntimeException("Error: Role MEMBER is not found.")));
                        break;
                }
            });
        }
        return roles;
    }

    // Helper to send WebSocket updates
    private void broadcastUserStats() {
        long totalUsers = userRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalUsers", totalUsers));
    }
}