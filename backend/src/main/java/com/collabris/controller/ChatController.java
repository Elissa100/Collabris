package com.collabris.controller;

import com.collabris.dto.request.ChatMessageRequest;
import com.collabris.dto.request.ChatRoomRequest;
import com.collabris.entity.ChatMessage;
import com.collabris.entity.ChatRoom;
import com.collabris.entity.User;
import com.collabris.repository.UserRepository;
import com.collabris.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat Management", description = "Chat and messaging APIs")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/rooms")
    @Operation(summary = "Get all chat rooms", description = "Retrieve all chat rooms")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms() {
        List<ChatRoom> chatRooms = chatService.getAllChatRooms();
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/rooms/{id}")
    @Operation(summary = "Get chat room by ID", description = "Retrieve chat room by ID")
    public ResponseEntity<ChatRoom> getChatRoomById(@PathVariable Long id) {
        ChatRoom chatRoom = chatService.getChatRoomById(id);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/rooms/project/{projectId}")
    @Operation(summary = "Get chat rooms by project", description = "Get chat rooms by project ID")
    public ResponseEntity<List<ChatRoom>> getChatRoomsByProject(@PathVariable Long projectId) {
        List<ChatRoom> chatRooms = chatService.getChatRoomsByProjectId(projectId);
        return ResponseEntity.ok(chatRooms);
    }

    @PostMapping("/rooms")
    @Operation(summary = "Create chat room", description = "Create a new chat room")
    public ResponseEntity<ChatRoom> createChatRoom(@Valid @RequestBody ChatRoomRequest chatRoomRequest, 
                                                  Authentication authentication) {
        User createdBy = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        ChatRoom chatRoom = chatService.createChatRoom(chatRoomRequest, createdBy);
        return ResponseEntity.ok(chatRoom);
    }

    @PutMapping("/rooms/{id}")
    @Operation(summary = "Update chat room", description = "Update chat room information")
    public ResponseEntity<ChatRoom> updateChatRoom(@PathVariable Long id, 
                                                  @Valid @RequestBody ChatRoomRequest chatRoomRequest) {
        ChatRoom chatRoom = chatService.updateChatRoom(id, chatRoomRequest);
        return ResponseEntity.ok(chatRoom);
    }

    @DeleteMapping("/rooms/{id}")
    @Operation(summary = "Delete chat room", description = "Delete chat room")
    public ResponseEntity<?> deleteChatRoom(@PathVariable Long id) {
        chatService.deleteChatRoom(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/{roomId}/messages")
    @Operation(summary = "Get messages", description = "Get messages from chat room")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long roomId) {
        List<ChatMessage> messages = chatService.getMessagesByChatRoomId(roomId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/rooms/{roomId}/messages/paged")
    @Operation(summary = "Get messages paged", description = "Get messages from chat room with pagination")
    public ResponseEntity<Page<ChatMessage>> getMessagesPaged(@PathVariable Long roomId, Pageable pageable) {
        ChatRoom chatRoom = chatService.getChatRoomById(roomId);
        Page<ChatMessage> messages = chatService.getMessagesByChatRoom(chatRoom, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/rooms/{roomId}/messages/recent")
    @Operation(summary = "Get recent messages", description = "Get recent messages since timestamp")
    public ResponseEntity<List<ChatMessage>> getRecentMessages(@PathVariable Long roomId, 
                                                              @RequestParam String since) {
        LocalDateTime sinceDateTime = LocalDateTime.parse(since);
        List<ChatMessage> messages = chatService.getRecentMessages(roomId, sinceDateTime);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    @Operation(summary = "Send message", description = "Send a message to chat room")
    public ResponseEntity<ChatMessage> sendMessage(@Valid @RequestBody ChatMessageRequest messageRequest, 
                                                  Authentication authentication) {
        User sender = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        ChatMessage message = chatService.sendMessage(messageRequest, sender);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/messages/{messageId}")
    @Operation(summary = "Delete message", description = "Delete a message")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId) {
        chatService.deleteMessage(messageId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/{roomId}/messages/count")
    @Operation(summary = "Get message count", description = "Get total message count for chat room")
    public ResponseEntity<Long> getMessageCount(@PathVariable Long roomId) {
        Long count = chatService.getMessageCount(roomId);
        return ResponseEntity.ok(count);
    }
}

@Controller
class WebSocketChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest messageRequest, Principal principal) {
        User sender = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        chatService.sendMessage(messageRequest, sender);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessageRequest messageRequest, Principal principal) {
        User sender = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        messageRequest.setType(ChatMessage.MessageType.JOIN);
        messageRequest.setContent(sender.getUsername() + " joined the chat");
        chatService.sendMessage(messageRequest, sender);
    }
}