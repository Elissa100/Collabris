package com.collabris.controller;

import com.collabris.dto.request.TeamRequest;
import com.collabris.dto.response.TeamResponse;
import com.collabris.entity.User;
import com.collabris.service.TeamService;
import com.collabris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<TeamResponse> createTeam(@RequestBody TeamRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        TeamResponse createdTeam = teamService.createTeam(request, getCurrentUser(userDetails));
        return ResponseEntity.ok(createdTeam);
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams(@AuthenticationPrincipal UserDetails userDetails) {
        List<TeamResponse> teams = teamService.getTeamsForUser(getCurrentUser(userDetails));
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Long teamId) {
        TeamResponse team = teamService.getTeamById(teamId);
        return ResponseEntity.ok(team);
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Long teamId, @RequestBody TeamRequest request) {
        TeamResponse updatedTeam = teamService.updateTeam(teamId, request);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamResponse> addMemberToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        TeamResponse team = teamService.addMemberToTeam(teamId, userId);
        return ResponseEntity.ok(team);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<TeamResponse> removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        TeamResponse team = teamService.removeMemberFromTeam(teamId, userId);
        return ResponseEntity.ok(team);
    }
}