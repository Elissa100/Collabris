package com.collabris.controller;

import com.collabris.dto.request.TeamRequest;
import com.collabris.dto.response.TeamResponse;
import com.collabris.entity.User;
import com.collabris.repository.UserRepository;
import com.collabris.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
@Tag(name = "Team Management", description = "Team management APIs")
@SecurityRequirement(name = "bearerAuth")
public class TeamController {
    
    @Autowired
    private TeamService teamService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get all teams", description = "Retrieve all teams")
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        List<TeamResponse> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get team by ID", description = "Retrieve team by ID")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Long id) {
        TeamResponse team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/my-teams")
    @Operation(summary = "Get user's teams", description = "Get teams the current user is a member of")
    public ResponseEntity<List<TeamResponse>> getMyTeams(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<TeamResponse> teams = teamService.getTeamsForUser(user);
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    @Operation(summary = "Create team", description = "Create a new team")
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody TeamRequest teamRequest, 
                                          Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        TeamResponse team = teamService.createTeam(teamRequest, owner);
        return ResponseEntity.ok(team);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update team", description = "Update team information")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Long id, 
                                          @Valid @RequestBody TeamRequest teamRequest) {
        TeamResponse team = teamService.updateTeam(id, teamRequest);
        return ResponseEntity.ok(team);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete team", description = "Delete team")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{teamId}/members/{userId}")
    @Operation(summary = "Add member to team", description = "Add a member to team")
    public ResponseEntity<TeamResponse> addMemberToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        TeamResponse team = teamService.addMemberToTeam(teamId, userId);
        return ResponseEntity.ok(team);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @Operation(summary = "Remove member from team", description = "Remove a member from team")
    public ResponseEntity<TeamResponse> removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        TeamResponse team = teamService.removeMemberFromTeam(teamId, userId);
        return ResponseEntity.ok(team);
    }
}