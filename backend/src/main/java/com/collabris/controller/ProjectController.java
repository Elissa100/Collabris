package com.collabris.controller;

import com.collabris.dto.request.ProjectRequest;
import com.collabris.entity.Project;
import com.collabris.entity.User;
import com.collabris.repository.UserRepository;
import com.collabris.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "Project management APIs")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieve all projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieve project by ID")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    @Operation(summary = "Get user's projects", description = "Get projects owned by current user")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Project> projects = projectService.getProjectsByOwner(user);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/member/{userId}")
    @Operation(summary = "Get projects by member", description = "Get projects where user is a member")
    public ResponseEntity<List<Project>> getProjectsByMember(@PathVariable Long userId) {
        List<Project> projects = projectService.getProjectsByMemberId(userId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/team/{teamId}")
    @Operation(summary = "Get projects by team", description = "Get projects by team ID")
    public ResponseEntity<List<Project>> getProjectsByTeam(@PathVariable Long teamId) {
        List<Project> projects = projectService.getProjectsByTeamId(teamId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    @Operation(summary = "Create project", description = "Create a new project")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest projectRequest, 
                                                Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Project project = projectService.createProject(projectRequest, owner);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project", description = "Update project information")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, 
                                                @Valid @RequestBody ProjectRequest projectRequest) {
        Project project = projectService.updateProject(id, projectRequest);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Delete project")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{projectId}/members/{userId}")
    @Operation(summary = "Add member to project", description = "Add a member to project")
    public ResponseEntity<Project> addMemberToProject(@PathVariable Long projectId, @PathVariable Long userId) {
        Project project = projectService.addMemberToProject(projectId, userId);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @Operation(summary = "Remove member from project", description = "Remove a member from project")
    public ResponseEntity<Project> removeMemberFromProject(@PathVariable Long projectId, @PathVariable Long userId) {
        Project project = projectService.removeMemberFromProject(projectId, userId);
        return ResponseEntity.ok(project);
    }
}