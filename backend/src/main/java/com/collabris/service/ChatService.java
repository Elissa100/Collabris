package com.collabris.service;

import com.collabris.dto.response.ChatMessageResponse;
import com.collabris.entity.ChatMessage;
import com.collabris.entity.User;
import com.collabris.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(String content, Long projectId, User sender) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setProjectId(projectId);
        message.setSender(sender);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessageResponse> getMessagesForProject(Long projectId) {
        return chatMessageRepository.findByProjectIdOrderByTimestampAsc(projectId)
                .stream()
                .map(ChatMessageResponse::new)
                .collect(Collectors.toList());
    }
}