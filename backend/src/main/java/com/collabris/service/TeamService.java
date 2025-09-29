package com.collabris.service;

import com.collabris.dto.request.TeamRequest;
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

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
    }

    public List<Team> getTeamsByOwner(User owner) {
        return teamRepository.findByOwner(owner);
    }

    public List<Team> getTeamsByMemberId(Long userId) {
        return teamRepository.findByMemberId(userId);
    }

    public Team createTeam(TeamRequest teamRequest, User owner) {
        Team team = new Team(teamRequest.getName(), teamRequest.getDescription(), owner);
        
        // Add members if provided
        if (teamRequest.getMemberIds() != null && !teamRequest.getMemberIds().isEmpty()) {
            Set<User> members = new HashSet<>();
            for (Long memberId : teamRequest.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + memberId));
                members.add(member);
            }
            team.setMembers(members);
        }
        
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, TeamRequest teamRequest) {
        Team team = getTeamById(id);
        
        if (teamRequest.getName() != null) {
            team.setName(teamRequest.getName());
        }
        if (teamRequest.getDescription() != null) {
            team.setDescription(teamRequest.getDescription());
        }
        
        // Update members if provided
        if (teamRequest.getMemberIds() != null) {
            Set<User> members = new HashSet<>();
            for (Long memberId : teamRequest.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + memberId));
                members.add(member);
            }
            team.setMembers(members);
        }
        
        return teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        Team team = getTeamById(id);
        teamRepository.delete(team);
    }

    public Team addMemberToTeam(Long teamId, Long userId) {
        Team team = getTeamById(teamId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        team.getMembers().add(user);
        return teamRepository.save(team);
    }

    public Team removeMemberFromTeam(Long teamId, Long userId) {
        Team team = getTeamById(teamId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        team.getMembers().remove(user);
        return teamRepository.save(team);
    }
}