package com.collabris.service;

import com.collabris.dto.request.TaskRequest;
import com.collabris.dto.response.TaskResponse;
import com.collabris.entity.*;
import com.collabris.repository.FileMetadataRepository;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.TaskRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    public TaskResponse createTask(TaskRequest request, Long projectId, User creator) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project not found with ID: " + projectId));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setCreator(creator);

        // --- UPDATED LOGIC ---
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NoSuchElementException("Assignee user not found with ID: " + request.getAssigneeId()));
            task.setAssignee(assignee);

            String message = String.format("%s assigned you a new task: '%s' in project '%s'",
                    creator.getUsername(), task.getTitle(), project.getName());
            notificationService.createAndSendNotification(creator, assignee, NotificationType.TASK_ASSIGNED, message, "task", task.getId());
        }
        
        if (request.getAttachmentIds() != null && !request.getAttachmentIds().isEmpty()) {
            Set<FileMetadata> attachments = new HashSet<>(fileMetadataRepository.findAllById(request.getAttachmentIds()));
            task.setAttachments(attachments);
        }

        Task savedTask = taskRepository.save(task);
        return new TaskResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksForProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new NoSuchElementException("Project not found with ID: " + projectId);
        }
        List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
        return tasks.stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksAssignedToUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NoSuchElementException("User not found with ID: " + userId);
        }
        List<Task> tasks = taskRepository.findByAssigneeIdOrderByDueDateAsc(userId);
        return tasks.stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task not found with ID: " + taskId));

        User oldAssignee = task.getAssignee();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        
        // --- UPDATED LOGIC ---
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NoSuchElementException("Assignee user not found with ID: " + request.getAssigneeId()));
            task.setAssignee(newAssignee);
            
            if (oldAssignee == null || !oldAssignee.getId().equals(newAssignee.getId())) {
                 String message = String.format("A task was assigned to you: '%s' in project '%s'",
                    task.getTitle(), task.getProject().getName());
                notificationService.createAndSendNotification(null, newAssignee, NotificationType.TASK_ASSIGNED, message, "task", task.getId());
            }
        } else {
            task.setAssignee(null);
        }
        
        if (request.getAttachmentIds() != null) {
            Set<FileMetadata> attachments = new HashSet<>(fileMetadataRepository.findAllById(request.getAttachmentIds()));
            task.setAttachments(attachments);
        }

        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new NoSuchElementException("Task not found with ID: " + taskId);
        }
        taskRepository.deleteById(taskId);
    }
}