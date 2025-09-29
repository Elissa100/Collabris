package com.collabris.repository;

import com.collabris.entity.ChatRoom;
import com.collabris.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByProject(Project project);
    List<ChatRoom> findByProjectId(Long projectId);
    List<ChatRoom> findByType(ChatRoom.RoomType type);
}