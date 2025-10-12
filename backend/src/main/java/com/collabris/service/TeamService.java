// File path: backend/src/main/java/com/collabris/service/TeamService.java
package com.collabris.service;

import com.collabris.dto.request.TeamRequest;
import com.collabris.dto.response.TeamResponse;
import com.collabris.entity.Team;
import com.collabris.entity.User;
import com.collabris.repository.TeamRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public TeamResponse createTeam(TeamRequest teamRequest, User owner) {
        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setDescription(teamRequest.getDescription());
        team.setOwner(owner);
        team.addMember(owner);

        Team savedTeam = teamRepository.save(team);

        long totalTeams = teamRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalTeams", totalTeams));

        return new TeamResponse(savedTeam);
    }

    public TeamResponse getTeamById(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NoSuchElementException("Team not found with ID: " + teamId));
        return new TeamResponse(team);
    }

    public List<TeamResponse> getTeamsForUser(User user) {
        return teamRepository.findByMemberId(user.getId()).stream()
                .map(TeamResponse::new)
                .collect(Collectors.toList());
    }

    public TeamResponse updateTeam(Long teamId, TeamRequest teamRequest) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NoSuchElementException("Team not found with ID: " + teamId));
        team.setName(teamRequest.getName());
        team.setDescription(teamRequest.getDescription());
        return new TeamResponse(teamRepository.save(team));
    }

    public void deleteTeam(Long teamId) {
        teamRepository.deleteById(teamId);
        
        long totalTeams = teamRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalTeams", totalTeams));
    }

    public TeamResponse addMemberToTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NoSuchElementException("Team not found with ID: " + teamId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        team.addMember(user);
        return new TeamResponse(teamRepository.save(team));
    }

    public TeamResponse removeMemberFromTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new NoSuchElementException("Team not found with ID: " + teamId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        team.removeMember(user);
        return new TeamResponse(teamRepository.save(team));
    }
}