package com.collabris.controller;

import com.collabris.dto.response.ActivityLogResponse;
import com.collabris.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ActivityController {

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping("/activity")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ActivityLogResponse>> getActivities() {
        return ResponseEntity.ok(activityLogService.getAllActivities());
    }
}