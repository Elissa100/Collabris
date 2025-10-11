// File Path: backend/src/main/java/com/collabris/dto/response/JwtResponse.java
package com.collabris.dto.response;

import com.collabris.entity.User;
import java.util.List;
import java.util.stream.Collectors;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UserResponse user; // FIX: Changed to include the full UserResponse object

    public JwtResponse(String accessToken, User user) {
        this.token = accessToken;
        this.user = new UserResponse(user); // Construct the UserResponse from the User entity
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
}