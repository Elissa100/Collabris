// File Path: backend/src/main/java/com/collabris/controller/UserController.java
package com.collabris.controller;

import com.collabris.dto.response.UserResponse;
import com.collabris.entity.User;
import com.collabris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // This endpoint is essential for the frontend's login process.
    // It fetches the details of the currently authenticated user.
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // If the JWT is valid, userDetails will not be null.
        if (userDetails == null) {
            // This case is rare as Spring Security's filter chain usually prevents it,
            // but it's a good safeguard.
            return ResponseEntity.status(401).build();
        }

        // Use the username from the JWT's principal to fetch the full User entity.
        // Your UserService has a findByUsername method, which is perfect for this.
        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found in the database."));

        // Convert the full User entity into your existing UserResponse DTO.
        // This DTO shapes the data correctly for the frontend.
        return ResponseEntity.ok(new UserResponse(user));
    }
}