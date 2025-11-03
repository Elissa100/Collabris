// File path: backend/src/main/java/com/collabris/controller/TaskController.java
package com.collabris.controller;

import com.collabris.dto.request.TaskRequest;
import com.collabris.dto.response.MessageResponse;
import com.collabris.dto.response.TaskResponse;
import com.collabris.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/tasks") // <-- Base path is now just /tasks
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Note: Task creation is now in ProjectController
    // Note: Getting all tasks for a project is now in ProjectController

    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN') or @taskRepository.findById(#taskId).get().getProject().getOwner().getUsername() == authentication.name")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @Valid @RequestBody TaskRequest taskRequest) {
        try {
            TaskResponse updatedTask = taskService.updateTask(taskId, taskRequest);
            return ResponseEntity.ok(updatedTask);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN') or @taskRepository.findById(#taskId).get().getProject().getOwner().getUsername() == authentication.name")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return ResponseEntity.ok(new MessageResponse("Task deleted successfully!"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }

    // --- DEPENDENCY ENDPOINTS ---

    @PostMapping("/{taskId}/dependencies/{dependencyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addDependency(@PathVariable Long taskId, @PathVariable Long dependencyId) {
        try {
            taskService.addDependency(taskId, dependencyId);
            return ResponseEntity.ok(new MessageResponse("Dependency added successfully."));
        } catch (IllegalStateException | NoSuchElementException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{taskId}/dependencies/{dependencyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeDependency(@PathVariable Long taskId, @PathVariable Long dependencyId) {
        taskService.removeDependency(taskId, dependencyId);
        return ResponseEntity.ok(new MessageResponse("Dependency removed successfully."));
    }
}