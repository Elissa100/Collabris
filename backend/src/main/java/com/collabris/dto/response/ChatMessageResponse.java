package com.collabris.dto.response;

import com.collabris.entity.ChatMessage;
import java.time.LocalDateTime;

public class ChatMessageResponse {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private UserResponse sender;
    private Long chatRoomId;

    public ChatMessageResponse(ChatMessage message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
        this.sender = new UserResponse(message.getSender());
        this.chatRoomId = message.getChatRoom().getId();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public UserResponse getSender() { return sender; }
    public void setSender(UserResponse sender) { this.sender = sender; }
    public Long getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(Long chatRoomId) { this.chatRoomId = chatRoomId; }
}