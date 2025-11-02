package com.collabris.dto.request;

import com.collabris.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Set;

public class TaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 255)
    private String title;

    private String description;

    private Task.Status status;

    private LocalDate dueDate;

    private Long assigneeId;

    private Set<Long> attachmentIds; // A set of IDs from FileMetadata

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Task.Status getStatus() { return status; }
    public void setStatus(Task.Status status) { this.status = status; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Long getAssigneeId() { return assigneeId; }
    public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }
    public Set<Long> getAttachmentIds() { return attachmentIds; }
    public void setAttachmentIds(Set<Long> attachmentIds) { this.attachmentIds = attachmentIds; }
}