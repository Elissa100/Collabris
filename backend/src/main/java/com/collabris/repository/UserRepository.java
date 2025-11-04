package com.collabris.repository;

import com.collabris.entity.Role;
import com.collabris.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    // RENAMED for clarity
    @Query("SELECT u FROM User u WHERE lower(u.username) LIKE lower(concat('%', :searchTerm, '%')) OR lower(u.email) LIKE lower(concat('%', :searchTerm, '%')) OR lower(u.firstName) LIKE lower(concat('%', :searchTerm, '%')) OR lower(u.lastName) LIKE lower(concat('%', :searchTerm, '%'))")
    List<User> searchByTerm(@Param("searchTerm") String searchTerm);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    long countByRoles_Name(Role.ERole roleName);
}