package com.collabris.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.TO_DO;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "task_attachments",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "file_metadata_id")
    )
    private Set<FileMetadata> attachments = new HashSet<>();

    // --- NEW: DEPENDENCY RELATIONSHIPS ---
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_dependencies",
        joinColumns = @JoinColumn(name = "task_id"), // The task that is blocked
        inverseJoinColumns = @JoinColumn(name = "dependency_id") // The task that must be completed first
    )
    private Set<Task> dependencies = new HashSet<>(); // Tasks that block this task

    @ManyToMany(mappedBy = "dependencies", fetch = FetchType.LAZY)
    private Set<Task> blocking = new HashSet<>(); // Tasks that this task blocks

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        TO_DO,
        IN_PROGRESS,
        DONE
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Helper Methods for Dependencies ---
    public void addDependency(Task task) {
        this.dependencies.add(task);
    }

    public void removeDependency(Task task) {
        this.dependencies.remove(task);
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    public Set<FileMetadata> getAttachments() { return attachments; }
    public void setAttachments(Set<FileMetadata> attachments) { this.attachments = attachments; }
    public Set<Task> getDependencies() { return dependencies; }
    public void setDependencies(Set<Task> dependencies) { this.dependencies = dependencies; }
    public Set<Task> getBlocking() { return blocking; }
    public void setBlocking(Set<Task> blocking) { this.blocking = blocking; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}