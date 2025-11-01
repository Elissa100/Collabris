package com.collabris.dto.response;

import com.collabris.entity.Notification;
import com.collabris.entity.NotificationType;
import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private String message;
    private boolean isRead;
    private String entityType;
    private Long entityId;
    private UserResponse sourceUser;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.type = notification.getType();
        this.message = notification.getMessage();
        this.isRead = notification.isRead();
        this.entityType = notification.getEntityType();
        this.entityId = notification.getEntityId();
        this.createdAt = notification.getCreatedAt();

        if (notification.getSourceUser() != null) {
            this.sourceUser = new UserResponse(notification.getSourceUser());
        }
    }

    // Getters
    public Long getId() { return id; }
    public NotificationType getType() { return type; }
    public String getMessage() { return message; }
    public boolean isRead() { return isRead; }
    public String getEntityType() { return entityType; }
    public Long getEntityId() { return entityId; }
    public UserResponse getSourceUser() { return sourceUser; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}