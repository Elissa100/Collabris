package com.collabris.repository;

import com.collabris.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectIdOrderByCreatedAtAsc(Long projectId);

    List<Task> findByAssigneeId(Long userId);

    List<Task> findByAssigneeIdOrderByDueDateAsc(Long userId);
    
    // --- NEW SEARCH METHOD ---
    @Query("SELECT t FROM Task t WHERE lower(t.title) LIKE lower(concat('%', :searchTerm, '%')) OR lower(t.description) LIKE lower(concat('%', :searchTerm, '%'))")
    List<Task> searchByTitleOrDescription(@Param("searchTerm") String searchTerm);
}