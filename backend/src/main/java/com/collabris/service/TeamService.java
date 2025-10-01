package com.collabris.service;

import com.collabris.dto.request.TeamRequest;
import com.collabris.dto.response.TeamResponse;
import com.collabris.entity.Team;
import com.collabris.entity.User;
import com.collabris.repository.TeamRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(TeamResponse::new)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
        return new TeamResponse(team);
    }

    public List<TeamResponse> getTeamsForUser(User user) {
        List<Team> ownedTeams = teamRepository.findByOwner(user);
        List<Team> memberTeams = teamRepository.findByMemberId(user.getId());

        return Stream.concat(ownedTeams.stream(), memberTeams.stream())
                .distinct()
                .map(TeamResponse::new)
                .collect(Collectors.toList());
    }

    public TeamResponse createTeam(TeamRequest teamRequest, User owner) {
        Team team = new Team(teamRequest.getName(), teamRequest.getDescription(), owner);
        
        if (teamRequest.getMemberIds() != null && !teamRequest.getMemberIds().isEmpty()) {
            Set<User> members = new HashSet<>(userRepository.findAllById(teamRequest.getMemberIds()));
            team.setMembers(members);
        }
        
        Team savedTeam = teamRepository.save(team);
        return new TeamResponse(savedTeam);
    }

    public TeamResponse updateTeam(Long id, TeamRequest teamRequest) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
        
        if (teamRequest.getName() != null) team.setName(teamRequest.getName());
        if (teamRequest.getDescription() != null) team.setDescription(teamRequest.getDescription());
        
        if (teamRequest.getMemberIds() != null) {
            Set<User> members = new HashSet<>(userRepository.findAllById(teamRequest.getMemberIds()));
            team.setMembers(members);
        }
        
        Team updatedTeam = teamRepository.save(team);
        return new TeamResponse(updatedTeam);
    }

    public void deleteTeam(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new RuntimeException("Team not found with id: " + id);
        }
        teamRepository.deleteById(id);
    }

    public TeamResponse addMemberToTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        team.getMembers().add(user);
        return new TeamResponse(teamRepository.save(team));
    }

    public TeamResponse removeMemberFromTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        team.getMembers().remove(user);
        return new TeamResponse(teamRepository.save(team));
    }
}