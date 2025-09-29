package com.collabris.service;

import com.collabris.dto.request.ChatMessageRequest;
import com.collabris.dto.request.ChatRoomRequest;
import com.collabris.entity.ChatMessage;
import com.collabris.entity.ChatRoom;
import com.collabris.entity.Project;
import com.collabris.entity.User;
import com.collabris.repository.ChatMessageRepository;
import com.collabris.repository.ChatRoomRepository;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<ChatRoom> getAllChatRooms() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom getChatRoomById(Long id) {
        return chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found with id: " + id));
    }

    public List<ChatRoom> getChatRoomsByProjectId(Long projectId) {
        return chatRoomRepository.findByProjectId(projectId);
    }

    public ChatRoom createChatRoom(ChatRoomRequest chatRoomRequest, User createdBy) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(chatRoomRequest.getName());
        chatRoom.setDescription(chatRoomRequest.getDescription());
        chatRoom.setType(chatRoomRequest.getType() != null ? chatRoomRequest.getType() : ChatRoom.RoomType.GROUP);
        chatRoom.setCreatedBy(createdBy);
        
        if (chatRoomRequest.getProjectId() != null) {
            Project project = projectRepository.findById(chatRoomRequest.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + chatRoomRequest.getProjectId()));
            chatRoom.setProject(project);
        }
        
        return chatRoomRepository.save(chatRoom);
    }

    public ChatRoom updateChatRoom(Long id, ChatRoomRequest chatRoomRequest) {
        ChatRoom chatRoom = getChatRoomById(id);
        
        if (chatRoomRequest.getName() != null) {
            chatRoom.setName(chatRoomRequest.getName());
        }
        if (chatRoomRequest.getDescription() != null) {
            chatRoom.setDescription(chatRoomRequest.getDescription());
        }
        if (chatRoomRequest.getType() != null) {
            chatRoom.setType(chatRoomRequest.getType());
        }
        
        return chatRoomRepository.save(chatRoom);
    }

    public void deleteChatRoom(Long id) {
        ChatRoom chatRoom = getChatRoomById(id);
        chatRoomRepository.delete(chatRoom);
    }

    public List<ChatMessage> getMessagesByChatRoomId(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomIdOrderByCreatedAtAsc(chatRoomId);
    }

    public Page<ChatMessage> getMessagesByChatRoom(ChatRoom chatRoom, Pageable pageable) {
        return chatMessageRepository.findByChatRoomOrderByCreatedAtDesc(chatRoom, pageable);
    }

    public List<ChatMessage> getRecentMessages(Long chatRoomId, LocalDateTime since) {
        return chatMessageRepository.findRecentMessages(chatRoomId, since);
    }

    public ChatMessage sendMessage(ChatMessageRequest messageRequest, User sender) {
        ChatRoom chatRoom = getChatRoomById(messageRequest.getChatRoomId());
        
        ChatMessage message = new ChatMessage();
        message.setContent(messageRequest.getContent());
        message.setType(messageRequest.getType());
        message.setSender(sender);
        message.setChatRoom(chatRoom);
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        
        // Send message to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoom.getId(), savedMessage);
        
        return savedMessage;
    }

    public void deleteMessage(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));
        chatMessageRepository.delete(message);
    }

    public Long getMessageCount(Long chatRoomId) {
        return chatMessageRepository.countByChatRoomId(chatRoomId);
    }
}