package com.collabris.repository;

import com.collabris.entity.Project;
import com.collabris.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
    
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId")
    List<Project> findByMemberId(@Param("userId") Long userId);
    
    // RENAMED for clarity
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.members WHERE lower(p.name) LIKE lower(concat('%', :searchTerm, '%')) OR lower(p.description) LIKE lower(concat('%', :searchTerm, '%'))")
    List<Project> searchByNameOrDescription(@Param("searchTerm") String searchTerm);
    
    // This query is no longer needed with the one above
    // List<Project> findByTeamId(@Param("teamId") Long teamId);
}