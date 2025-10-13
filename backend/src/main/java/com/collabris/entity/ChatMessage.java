// File Path: backend/src/main/java/com/collabris/entity/ChatMessage.java
package com.collabris.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // --- THIS IS THE NEW FIELD ---
    @Column(name = "project_id", nullable = false)
    private Long projectId;
    // --- END OF NEW FIELD ---

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
}