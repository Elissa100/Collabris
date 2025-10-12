package com.collabris.controller;

import com.collabris.dto.request.TeamRequest;
import com.collabris.dto.response.TeamResponse;
import com.collabris.entity.User;
import com.collabris.service.TeamService;
import com.collabris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;
    @Autowired
    private UserService userService;
    
    private User getCurrentUser(UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Authenticated user not found in database."));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> createTeam(@RequestBody TeamRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.createTeam(request, getCurrentUser(userDetails)));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getAllTeams(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teamService.getTeamsForUser(getCurrentUser(userDetails)));
    }

    @GetMapping("/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamById(teamId));
    }

    @PutMapping("/{teamId}")
    @PreAuthorize("hasRole('ADMIN') or @teamRepository.findById(#teamId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Long teamId, @RequestBody TeamRequest request) {
        return ResponseEntity.ok(teamService.updateTeam(teamId, request));
    }

    @DeleteMapping("/{teamId}")
    @PreAuthorize("hasRole('ADMIN') or @teamRepository.findById(#teamId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{teamId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @teamRepository.findById(#teamId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<TeamResponse> addMemberToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.addMemberToTeam(teamId, userId));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @teamRepository.findById(#teamId).get().getOwner().getUsername() == authentication.name")
    public ResponseEntity<TeamResponse> removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.removeMemberFromTeam(teamId, userId));
    }
}
