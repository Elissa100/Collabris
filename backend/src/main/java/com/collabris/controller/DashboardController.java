// File Path: backend/src/main/java/com/collabris/controller/DashboardController.java
package com.collabris.controller;

import com.collabris.entity.Role;
import com.collabris.entity.User;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.TeamRepository;
import com.collabris.repository.UserRepository;
import com.collabris.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard Analytics", description = "Endpoints for fetching role-specific dashboard data")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserService userService;

    // Helper to get the full User entity from the security context
    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userService.findByUsername(userDetails.getUsername()).orElse(null);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Admin Dashboard Stats", description = "Provides system-wide statistics for the admin dashboard. Requires ADMIN role.")
    public ResponseEntity<?> getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProjects = projectRepository.count();
        long totalTeams = teamRepository.count();

        // --- NEW LOGIC FOR PIE CHART ---
        // Count users for each role
        long adminCount = userRepository.countByRoles_Name(Role.ERole.ADMIN);
        long managerCount = userRepository.countByRoles_Name(Role.ERole.MANAGER);
        long memberCount = userRepository.countByRoles_Name(Role.ERole.MEMBER);

        List<Map<String, Object>> roleDistribution = List.of(
            Map.of("name", "Admins", "value", adminCount),
            Map.of("name", "Managers", "value", managerCount),
            Map.of("name", "Members", "value", memberCount)
        );
        // --- END OF NEW LOGIC ---

        // Mock the user growth data for now, as it requires complex queries.
        // It's dynamically calculated to show the current total users in the last month.
        List<Map<String, Object>> userGrowth = List.of(
            Map.of("name", "Jan", "users", 0), Map.of("name", "Feb", "users", 0),
            Map.of("name", "Mar", "users", 0), Map.of("name", "Apr", "users", 0),
            Map.of("name", "May", "users", 0), Map.of("name", "Jun", "users", totalUsers)
        );

        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalProjects", totalProjects,
            "totalTeams", totalTeams,
            "roleDistribution", roleDistribution, // Add new data to response
            "userGrowth", userGrowth             // Add new data to response
        ));
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get Manager Dashboard Stats", description = "Provides overview statistics for the manager dashboard. Requires MANAGER or ADMIN role.")
    public ResponseEntity<?> getManagerDashboardStats() {
        long totalProjects = projectRepository.count();
        long totalTeams = teamRepository.count();
        long tasksCompleted = 78; // Placeholder value for demonstration

        return ResponseEntity.ok(Map.of(
            "totalProjects", totalProjects,
            "totalTeams", totalTeams,
            "tasksCompletedThisWeek", tasksCompleted
        ));
    }

    @GetMapping("/member")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get Member Dashboard Stats", description = "Provides statistics specific to the currently authenticated user. Requires any authenticated role.")
    public ResponseEntity<?> getMemberDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = getCurrentUser(userDetails);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Use the existing repository methods to get counts
        long myProjectsCount = projectRepository.findByMemberId(currentUser.getId()).size();
        long myTeamsCount = teamRepository.findByMemberId(currentUser.getId()).size();
        long myTasksDue = 8; // Placeholder value for demonstration
        
        return ResponseEntity.ok(Map.of(
            "myProjects", myProjectsCount,
            "myTeams", myTeamsCount,
            "myTasksDue", myTasksDue
        ));
    }
}