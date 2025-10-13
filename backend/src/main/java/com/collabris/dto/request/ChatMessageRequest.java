package com.collabris.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageRequest {

    @NotBlank
    private String content;
    
    // No messageType for now, we will just assume TEXT to fix the error.
    
    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}