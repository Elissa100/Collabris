package com.collabris.repository;

import com.collabris.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // Find all activities, newest first
    List<ActivityLog> findAllByOrderByTimestampDesc();
}