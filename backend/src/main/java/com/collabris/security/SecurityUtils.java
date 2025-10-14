package com.collabris.security;

import com.collabris.entity.Project;
import com.collabris.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("securityUtils") // This name lets us reference it in security annotations
public class SecurityUtils {

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Checks if the currently authenticated user is a member of the given project.
     * This method is designed to be called from @PreAuthorize annotations.
     * @param projectId The ID of the project to check.
     * @return true if the user is a member, false otherwise.
     */
    @Transactional(readOnly = true) // Ensures this runs within a Hibernate session to prevent lazy loading issues
    public boolean isProjectMember(Long projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUsername = authentication.getName();
        if (currentUsername == null) {
            return false;
        }
        
        Project project = projectRepository.findById(projectId).orElse(null);

        if (project == null) {
            // If the project doesn't exist, deny access.
            return false;
        }

        // Check if any member in the project's member list has the same username.
        return project.getMembers().stream()
                .anyMatch(member -> member.getUsername().equals(currentUsername));
    }
}