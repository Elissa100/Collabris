package com.collabris.service;

import com.collabris.dto.response.ActivityLogResponse;
import com.collabris.entity.ActivityLog;
import com.collabris.entity.User;
import com.collabris.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(User actor, String action, String entityType, Long entityId, String details) {
        ActivityLog log = new ActivityLog();
        log.setActor(actor);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getAllActivities() {
        return activityLogRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(ActivityLogResponse::new)
                .collect(Collectors.toList());
    }
}