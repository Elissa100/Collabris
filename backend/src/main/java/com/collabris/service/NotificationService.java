package com.collabris.service;

import com.collabris.dto.response.NotificationResponse;
import com.collabris.entity.Notification;
import com.collabris.entity.NotificationType;
import com.collabris.entity.User;
import com.collabris.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Creates and sends a notification.
     * This is the primary method other services will call.
     */
    public void createAndSendNotification(User sourceUser, User targetUser, NotificationType type, String message, String entityType, Long entityId) {
        if (targetUser.equals(sourceUser)) {
            // Don't notify users of their own actions
            return;
        }

        Notification notification = new Notification();
        notification.setSourceUser(sourceUser);
        notification.setTargetUser(targetUser);
        notification.setType(type);
        notification.setMessage(message);
        notification.setEntityType(entityType);
        notification.setEntityId(entityId);

        Notification savedNotification = notificationRepository.save(notification);

        // Send the notification via WebSocket to the target user's private channel
        logger.info("Sending notification to user '{}' at /queue/notifications", targetUser.getUsername());
        messagingTemplate.convertAndSendToUser(
            targetUser.getUsername(),
            "/queue/notifications",
            new NotificationResponse(savedNotification)
        );
    }

    /**
     * Retrieves all notifications for a given user.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository.findByTargetUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Marks a single notification as read.
     * @return true if the notification was found and marked as read.
     */
    public boolean markAsRead(Long notificationId, Long userId) {
        return notificationRepository.findById(notificationId)
                .map(notification -> {
                    // Ensure the user is authorized to read this notification
                    if (!notification.getTargetUser().getId().equals(userId)) {
                        throw new SecurityException("User not authorized to mark this notification as read.");
                    }
                    notification.setRead(true);
                    notificationRepository.save(notification);
                    return true;
                }).orElse(false);
    }
}