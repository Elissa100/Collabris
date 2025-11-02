package com.collabris.dto.response;

import com.collabris.entity.ActivityLog;
import java.time.LocalDateTime;

public class ActivityLogResponse {
    private Long id;
    private UserResponse actor;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private LocalDateTime timestamp;

    public ActivityLogResponse(ActivityLog log) {
        this.id = log.getId();
        this.action = log.getAction();
        this.entityType = log.getEntityType();
        this.entityId = log.getEntityId();
        this.details = log.getDetails();
        this.timestamp = log.getTimestamp();
        if (log.getActor() != null) {
            this.actor = new UserResponse(log.getActor());
        }
    }

    // Getters
    public Long getId() { return id; }
    public UserResponse getActor() { return actor; }
    public String getAction() { return action; }
    public String getEntityType() { return entityType; }
    public Long getEntityId() { return entityId; }
    public String getDetails() { return details; }
    public LocalDateTime getTimestamp() { return timestamp; }
}