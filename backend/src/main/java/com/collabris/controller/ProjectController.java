package com.collabris.controller;

import com.collabris.dto.request.ProjectRequest;
import com.collabris.dto.response.ProjectResponse;
import com.collabris.entity.User;
import com.collabris.service.ProjectService;
import com.collabris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserService userService;

    // Helper to get the full User entity from security context
    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        // Your Service correctly returns a Project entity, so we convert it to a Response DTO
        return ResponseEntity.ok(new ProjectResponse(projectService.createProject(request, getCurrentUser(userDetails))));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllForCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // Your Service method name is "getProjectsByMemberId", so we use that.
        List<ProjectResponse> projects = projectService.getProjectsByMemberId(getCurrentUser(userDetails).getId())
                .stream()
                .map(ProjectResponse::new)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long projectId) {
        // Your service returns the Entity, we must convert it.
        return ResponseEntity.ok(new ProjectResponse(projectService.getProjectById(projectId)));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long projectId, @RequestBody ProjectRequest request) {
        // Your service `updateProject` method does not require a user object.
        return ResponseEntity.ok(new ProjectResponse(projectService.updateProject(projectId, request)));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ProjectResponse> addMemberToProject(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(new ProjectResponse(projectService.addMemberToProject(projectId, userId)));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ProjectResponse> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(new ProjectResponse(projectService.removeMemberFromProject(projectId, userId)));
    }
}