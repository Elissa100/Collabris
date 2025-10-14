package com.collabris.repository;

import com.collabris.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find all tasks for a specific project, ordered by creation date
    List<Task> findByProjectIdOrderByCreatedAtAsc(Long projectId);

    // Find all tasks assigned to a specific user
    List<Task> findByAssigneeId(Long userId);

}