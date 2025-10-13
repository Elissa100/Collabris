package com.collabris.controller;

import com.collabris.dto.request.ProjectRequest;
import com.collabris.dto.response.ProjectResponse;
import com.collabris.entity.User;
import com.collabris.service.ProjectService;
import com.collabris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found in database."));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        // FIX: Service now returns the correct DTO directly
        return ResponseEntity.ok(projectService.createProject(request, getCurrentUser(userDetails)));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProjectResponse>> getAllForCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getProjectsByMemberId(getCurrentUser(userDetails).getId()));
    }

    @GetMapping("/{projectId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN') or @projectRepository.findById(#projectId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long projectId, @RequestBody ProjectRequest request) {
        // FIX: Service now returns the correct DTO directly
        return ResponseEntity.ok(projectService.updateProject(projectId, request));
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN') or @projectRepository.findById(#projectId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @projectRepository.findById(#projectId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<ProjectResponse> addMemberToProject(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(projectService.addMemberToProject(projectId, userId));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @projectRepository.findById(#projectId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<ProjectResponse> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        return ResponseEntity.ok(projectService.removeMemberFromProject(projectId, userId));
    }
}