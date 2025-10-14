package com.collabris.dto.response;

import com.collabris.entity.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private LocalDate dueDate;
    private Long projectId;
    private UserResponse assignee; // Can be null
    private UserResponse creator;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.dueDate = task.getDueDate();
        this.projectId = task.getProject().getId();
        this.creator = new UserResponse(task.getCreator());
        this.createdAt = task.getCreatedAt();
        this.updatedAt = task.getUpdatedAt();

        if (task.getAssignee() != null) {
            this.assignee = new UserResponse(task.getAssignee());
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Task.Status getStatus() { return status; }
    public LocalDate getDueDate() { return dueDate; }
    public Long getProjectId() { return projectId; }
    public UserResponse getAssignee() { return assignee; }
    public UserResponse getCreator() { return creator; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}