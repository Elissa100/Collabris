package com.collabris.service;

import com.collabris.dto.response.ChatMessageResponse;
import com.collabris.entity.ChatMessage;
import com.collabris.entity.ChatRoom;
import com.collabris.entity.Project;
import com.collabris.entity.User;
import com.collabris.repository.ChatMessageRepository;
import com.collabris.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ProjectRepository projectRepository;

    public ChatMessage saveMessage(String content, Long projectId, User sender) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project not found with ID: " + projectId));
        
        ChatRoom chatRoom = project.getChatRoom();
        if (chatRoom == null) {
            throw new IllegalStateException("Project " + projectId + " does not have an associated chat room.");
        }

        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessageResponse> getMessagesForProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project not found with ID: " + projectId));

        ChatRoom chatRoom = project.getChatRoom();
        if (chatRoom == null) {
            return List.of();
        }

        return chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoom.getId())
                .stream()
                .map(ChatMessageResponse::new)
                .collect(Collectors.toList());
    }
}