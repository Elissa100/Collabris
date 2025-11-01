package com.collabris.service;

import com.collabris.dto.request.TaskRequest;
import com.collabris.dto.response.TaskResponse;
import com.collabris.entity.NotificationType;
import com.collabris.entity.Project;
import com.collabris.entity.Task;
import com.collabris.entity.User;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.TaskRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
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

    // --- NEW DEPENDENCY ---
    @Autowired
    private NotificationService notificationService;

    /**
     * Creates a new task within a given project.
     * @param request The DTO containing task details.
     * @param projectId The ID of the project to add the task to.
     * @param creator The user who is creating the task.
     * @return The created task as a DTO.
     */
    public TaskResponse createTask(TaskRequest request, Long projectId, User creator) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project not found with ID: " + projectId));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setCreator(creator);

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NoSuchElementException("Assignee user not found with ID: " + request.getAssigneeId()));
            task.setAssignee(assignee);

            // --- NOTIFICATION LOGIC ---
            String message = String.format("%s assigned you a new task: '%s' in project '%s'",
                    creator.getUsername(), task.getTitle(), project.getName());
            notificationService.createAndSendNotification(creator, assignee, NotificationType.TASK_ASSIGNED, message, "task", task.getId());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        Task savedTask = taskRepository.save(task);
        return new TaskResponse(savedTask);
    }

    /**
     * Retrieves all tasks for a specific project.
     * @param projectId The ID of the project.
     * @return A list of task DTOs.
     */
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
    
    /**
     * Retrieves all tasks assigned to a specific user.
     * @param userId The ID of the user.
     * @return A list of task DTOs sorted by due date.
     */
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

    /**
     * Updates an existing task.
     * @param taskId The ID of the task to update.
     * @param request The DTO with the new task details.
     * @return The updated task as a DTO.
     */
    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task not found with ID: " + taskId));

        User oldAssignee = task.getAssignee();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        if (request.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NoSuchElementException("Assignee user not found with ID: " + request.getAssigneeId()));
            task.setAssignee(newAssignee);
            
            // --- NOTIFICATION LOGIC ON RE-ASSIGNMENT ---
            if (oldAssignee == null || !oldAssignee.getId().equals(newAssignee.getId())) {
                 String message = String.format("A task was assigned to you: '%s' in project '%s'",
                    task.getTitle(), task.getProject().getName());
                // Here we can assume the system (or the updater) is the source. For now, let's pass null.
                notificationService.createAndSendNotification(null, newAssignee, NotificationType.TASK_ASSIGNED, message, "task", task.getId());
            }

        } else {
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);
        return new TaskResponse(updatedTask);
    }

    /**
     * Deletes a task by its ID.
     * @param taskId The ID of the task to delete.
     */
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new NoSuchElementException("Task not found with ID: " + taskId);
        }
        taskRepository.deleteById(taskId);
    }
}