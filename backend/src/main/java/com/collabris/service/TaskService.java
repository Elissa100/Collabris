package com.collabris.service;

import com.collabris.dto.request.TaskRequest;
import com.collabris.dto.response.TaskResponse;
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

        // If an assignee ID is provided, find and set the assignee
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NoSuchElementException("Assignee user not found with ID: " + request.getAssigneeId()));
            task.setAssignee(assignee);
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
     * Updates an existing task.
     * @param taskId The ID of the task to update.
     * @param request The DTO with the new task details.
     * @return The updated task as a DTO.
     */
    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NoSuchElementException("Task not found with ID: " + taskId));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        // Handle updating the assignee
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new NoSuchElementException("Assignee user not found with ID: " + request.getAssigneeId()));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null); // Allow un-assigning a task
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