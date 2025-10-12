// File path: backend/src/main/java/com/collabris/dto/response/ProjectResponse.java
package com.collabris.dto.response;

import com.collabris.entity.Project;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private UserResponse owner;
    private Set<UserResponse> members;
    private LocalDateTime createdAt;
    
    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        if(project.getOwner() != null) {
            this.owner = new UserResponse(project.getOwner());
        }
        if(project.getMembers() != null) {
            this.members = project.getMembers().stream()
                .map(UserResponse::new)
                .collect(Collectors.toSet());
        }
        this.createdAt = project.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public UserResponse getOwner() { return owner; }
    public void setOwner(UserResponse owner) { this.owner = owner; }
    public Set<UserResponse> getMembers() { return members; }
    public void setMembers(Set<UserResponse> members) { this.members = members; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}