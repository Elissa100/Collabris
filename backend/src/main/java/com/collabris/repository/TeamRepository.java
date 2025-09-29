package com.collabris.repository;

import com.collabris.entity.Team;
import com.collabris.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByOwner(User owner);
    
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId")
    List<Team> findByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Team t WHERE t.name LIKE %:search% OR t.description LIKE %:search%")
    List<Team> findBySearchTerm(@Param("search") String search);
}