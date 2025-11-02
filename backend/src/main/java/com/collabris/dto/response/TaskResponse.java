package com.collabris.dto.response;

import com.collabris.entity.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority; // --- NEW FIELD ---
    private LocalDate dueDate;
    private Long projectId;
    private UserResponse assignee;
    private UserResponse creator;
    private Set<FileMetadataResponse> attachments; // --- NEW FIELD ---
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.priority = task.getPriority(); // --- NEW ---
        this.dueDate = task.getDueDate();
        this.projectId = task.getProject().getId();
        this.creator = new UserResponse(task.getCreator());
        this.createdAt = task.getCreatedAt();
        this.updatedAt = task.getUpdatedAt();

        if (task.getAssignee() != null) {
            this.assignee = new UserResponse(task.getAssignee());
        }

        if (task.getAttachments() != null) {
            this.attachments = task.getAttachments().stream()
                    .map(FileMetadataResponse::new)
                    .collect(Collectors.toSet());
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Task.Status getStatus() { return status; }
    public Task.Priority getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public Long getProjectId() { return projectId; }
    public UserResponse getAssignee() { return assignee; }
    public UserResponse getCreator() { return creator; }
    public Set<FileMetadataResponse> getAttachments() { return attachments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}