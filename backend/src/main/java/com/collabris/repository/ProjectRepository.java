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
    
    @Query("SELECT p FROM Project p WHERE p.team.id = :teamId")
    List<Project> findByTeamId(@Param("teamId") Long teamId);
    
    @Query("SELECT p FROM Project p WHERE p.name LIKE %:search% OR p.description LIKE %:search%")
    List<Project> findBySearchTerm(@Param("search") String search);
}