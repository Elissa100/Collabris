package com.collabris.dto.request;

import com.collabris.entity.ChatMessage;
import jakarta.validation.constraints.NotBlank;

public class ChatMessageRequest {
    @NotBlank
    private String content;

    private ChatMessage.MessageType type = ChatMessage.MessageType.CHAT;
    private Long chatRoomId;

    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public ChatMessage.MessageType getType() { return type; }
    public void setType(ChatMessage.MessageType type) { this.type = type; }

    public Long getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(Long chatRoomId) { this.chatRoomId = chatRoomId; }
}