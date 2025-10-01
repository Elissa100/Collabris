package com.collabris.dto.response;

import com.collabris.entity.Project;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Project.ProjectStatus status;
    private UserResponse owner;
    private Long teamId; // Sending teamId is simpler than the full Team object
    private Set<UserResponse> members;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.status = project.getStatus();
        this.owner = new UserResponse(project.getOwner());
        if (project.getTeam() != null) {
            this.teamId = project.getTeam().getId();
        }
        this.members = project.getMembers().stream()
                .map(UserResponse::new)
                .collect(Collectors.toSet());
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.createdAt = project.getCreatedAt();
    }

    // Getters for all fields
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Project.ProjectStatus getStatus() { return status; }
    public UserResponse getOwner() { return owner; }
    public Long getTeamId() { return teamId; }
    public Set<UserResponse> getMembers() { return members; }
    public LocalDateTime getStartDate() { return startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}