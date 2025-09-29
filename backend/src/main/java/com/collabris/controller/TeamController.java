package com.collabris.controller;

import com.collabris.dto.request.TeamRequest;
import com.collabris.entity.Team;
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
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get team by ID", description = "Retrieve team by ID")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/my-teams")
    @Operation(summary = "Get user's teams", description = "Get teams owned by current user")
    public ResponseEntity<List<Team>> getMyTeams(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Team> teams = teamService.getTeamsByOwner(user);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/member/{userId}")
    @Operation(summary = "Get teams by member", description = "Get teams where user is a member")
    public ResponseEntity<List<Team>> getTeamsByMember(@PathVariable Long userId) {
        List<Team> teams = teamService.getTeamsByMemberId(userId);
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    @Operation(summary = "Create team", description = "Create a new team")
    public ResponseEntity<Team> createTeam(@Valid @RequestBody TeamRequest teamRequest, 
                                          Authentication authentication) {
        User owner = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Team team = teamService.createTeam(teamRequest, owner);
        return ResponseEntity.ok(team);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update team", description = "Update team information")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, 
                                          @Valid @RequestBody TeamRequest teamRequest) {
        Team team = teamService.updateTeam(id, teamRequest);
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
    public ResponseEntity<Team> addMemberToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        Team team = teamService.addMemberToTeam(teamId, userId);
        return ResponseEntity.ok(team);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @Operation(summary = "Remove member from team", description = "Remove a member from team")
    public ResponseEntity<Team> removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        Team team = teamService.removeMemberFromTeam(teamId, userId);
        return ResponseEntity.ok(team);
    }
}