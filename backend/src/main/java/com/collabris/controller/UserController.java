// File Path: backend/src/main/java/com/collabris/controller/UserController.java
package com.collabris.controller;

import com.collabris.dto.request.AdminUserUpdateRequest;
import com.collabris.dto.response.MessageResponse;
import com.collabris.dto.response.UserResponse;
import com.collabris.entity.User;
import com.collabris.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // --- EXISTING ENDPOINT (NO CHANGE) ---
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found."));
        return ResponseEntity.ok(new UserResponse(user));
    }

    // --- NEW ADMIN ENDPOINTS ---

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserUpdateRequest request) {
        try {
            User newUser = userService.createUserByAdmin(request);
            return ResponseEntity.ok(new UserResponse(newUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @Valid @RequestBody AdminUserUpdateRequest request) {
        try {
            User updatedUser = userService.updateUserByAdmin(userId, request);
            return ResponseEntity.ok(new UserResponse(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        // Optional: Add logic to prevent an admin from deleting themselves
        userService.deleteUserByAdmin(userId);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }
}