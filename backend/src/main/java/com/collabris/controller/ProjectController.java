// File Path: backend/src/main/java/com/collabris/controller/ProjectController.java
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserService userService;

    // Helper method to get the full, real User entity from the database
    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found in database."));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        // FIX: Get the full User entity before passing it to the service
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(new ProjectResponse(projectService.createProject(request, currentUser)));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllForCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // FIX: Get the full User entity to find their projects
        User currentUser = getCurrentUser(userDetails);
        List<ProjectResponse> projects = projectService.getProjectsByMemberId(currentUser.getId())
                .stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(new ProjectResponse(projectService.getProjectById(projectId)));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long projectId, @RequestBody ProjectRequest request) {
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