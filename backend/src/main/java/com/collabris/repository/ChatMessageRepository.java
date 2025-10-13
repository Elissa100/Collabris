package com.collabris.repository;

import com.collabris.entity.ChatMessage;
import com.collabris.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom, Pageable pageable);
    
    List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long chatRoomId);

      List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(Long chatRoomId);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.chatRoom.id = :chatRoomId AND m.createdAt >= :since ORDER BY m.createdAt ASC")
    List<ChatMessage> findRecentMessages(@Param("chatRoomId") Long chatRoomId, @Param("since") LocalDateTime since);
    
    List<ChatMessage> findByProjectIdOrderByTimestampAsc(Long projectId);
    Long countByChatRoomId(Long chatRoomId);
}