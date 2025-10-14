package com.collabris.controller;

import com.collabris.dto.request.TaskRequest;
import com.collabris.dto.response.MessageResponse;
import com.collabris.dto.response.TaskResponse;
import com.collabris.entity.User;
import com.collabris.service.TaskService;
import com.collabris.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    // Helper to get the current user entity from security context
    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    /**
     * Endpoint to create a new task within a project.
     * Only members of the project can create tasks.
     */
    @PostMapping("/projects/{projectId}/tasks")
    @PreAuthorize("isAuthenticated() and @securityUtils.isProjectMember(#projectId)")
    public ResponseEntity<TaskResponse> createTask(@PathVariable Long projectId,
                                                   @Valid @RequestBody TaskRequest taskRequest,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        TaskResponse createdTask = taskService.createTask(taskRequest, projectId, getCurrentUser(userDetails));
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    /**
     * Endpoint to get all tasks for a specific project.
     * Only members of the project can view tasks.
     */
    @GetMapping("/projects/{projectId}/tasks")
    @PreAuthorize("isAuthenticated() and @securityUtils.isProjectMember(#projectId)")
    public ResponseEntity<List<TaskResponse>> getTasksForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksForProject(projectId));
    }

    /**
     * Endpoint to update an existing task.
     * Only the project owner or an admin can update tasks.
     */
    @PutMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ADMIN') or @taskRepository.findById(#taskId).get().getProject().getOwner().getUsername() == authentication.name")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @Valid @RequestBody TaskRequest taskRequest) {
        try {
            TaskResponse updatedTask = taskService.updateTask(taskId, taskRequest);
            return ResponseEntity.ok(updatedTask);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Endpoint to delete a task.
     * Only the project owner or an admin can delete tasks.
     */
    @DeleteMapping("/tasks/{taskId}")
    @PreAuthorize("hasRole('ADMIN') or @taskRepository.findById(#taskId).get().getProject().getOwner().getUsername() == authentication.name")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return ResponseEntity.ok(new MessageResponse("Task deleted successfully!"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }
}