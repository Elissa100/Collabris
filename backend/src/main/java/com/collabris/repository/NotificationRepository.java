package com.collabris.repository;

import com.collabris.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find all notifications for a specific user, ordered with the newest first.
    List<Notification> findByTargetUserIdOrderByCreatedAtDesc(Long userId);

    // Count unread notifications for a specific user.
    long countByTargetUserIdAndIsReadFalse(Long userId);
}