package com.collabris.controller;

import com.collabris.dto.request.ChatMessageRequest;
import com.collabris.dto.response.ChatMessageResponse; // Now correctly imported
import com.collabris.entity.ChatMessage;
import com.collabris.entity.User;
import com.collabris.service.ChatService;
import com.collabris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatService chatService;
    @Autowired
    private UserService userService;

    // HTTP Endpoint for Message History
    @GetMapping("/api/chat/projects/{projectId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getProjectMessages(@PathVariable Long projectId) {
        return ResponseEntity.ok(chatService.getMessagesForProject(projectId));
    }

    // WebSocket Endpoint for Sending a New Message
    @MessageMapping("/chat/{projectId}/sendMessage")
    public void sendMessage(@DestinationVariable Long projectId, @Payload ChatMessageRequest chatMessage, Principal principal) {
        if (principal == null) {
            // Should not happen if security is configured correctly, but good to check
            return;
        }
        User sender = userService.findByUsername(principal.getName())
            .orElseThrow(() -> new RuntimeException("Sender not found for authenticated principal"));
            
        ChatMessage savedMessage = chatService.saveMessage(chatMessage.getContent(), projectId, sender);
        
        ChatMessageResponse response = new ChatMessageResponse(savedMessage);

        messagingTemplate.convertAndSend("/topic/project/" + projectId + "/chat", response);
    }
}