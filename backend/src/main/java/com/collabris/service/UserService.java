package com.collabris.service;

import com.collabris.dto.response.UserResponse;
import com.collabris.entity.User;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public User saveUser(User user) {
        User savedUser = userRepository.save(user);

        // --- WebSocket Event ---
        // After saving a new user, get the new total count and send a message
        // to the "/topic/dashboard/stats" channel.
        long totalUsers = userRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalUsers", totalUsers));

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
}