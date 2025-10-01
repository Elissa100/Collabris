package com.collabris.dto.response;

import com.collabris.entity.Team;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private UserResponse owner;
    private Set<UserResponse> members;
    private LocalDateTime createdAt;

    public TeamResponse(Team team) {
        this.id = team.getId();
        this.name = team.getName();
        this.description = team.getDescription();
        this.owner = new UserResponse(team.getOwner());
        this.members = team.getMembers().stream()
                .map(UserResponse::new)
                .collect(Collectors.toSet());
        this.createdAt = team.getCreatedAt();
    }

    // Getters for all fields
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public UserResponse getOwner() { return owner; }
    public Set<UserResponse> getMembers() { return members; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}