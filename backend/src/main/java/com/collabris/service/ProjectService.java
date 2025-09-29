package com.collabris.service;

import com.collabris.dto.request.ProjectRequest;
import com.collabris.entity.Project;
import com.collabris.entity.Team;
import com.collabris.entity.User;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.TeamRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TeamRepository teamRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public List<Project> getProjectsByOwner(User owner) {
        return projectRepository.findByOwner(owner);
    }

    public List<Project> getProjectsByMemberId(Long userId) {
        return projectRepository.findByMemberId(userId);
    }

    public List<Project> getProjectsByTeamId(Long teamId) {
        return projectRepository.findByTeamId(teamId);
    }

    public Project createProject(ProjectRequest projectRequest, User owner) {
        Project project = new Project(projectRequest.getName(), projectRequest.getDescription(), owner);
        
        if (projectRequest.getStatus() != null) {
            project.setStatus(projectRequest.getStatus());
        }
        
        if (projectRequest.getStartDate() != null) {
            project.setStartDate(projectRequest.getStartDate());
        }
        
        if (projectRequest.getEndDate() != null) {
            project.setEndDate(projectRequest.getEndDate());
        }
        
        // Set team if provided
        if (projectRequest.getTeamId() != null) {
            Team team = teamRepository.findById(projectRequest.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found with id: " + projectRequest.getTeamId()));
            project.setTeam(team);
        }
        
        // Add members if provided
        if (projectRequest.getMemberIds() != null && !projectRequest.getMemberIds().isEmpty()) {
            Set<User> members = new HashSet<>();
            for (Long memberId : projectRequest.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + memberId));
                members.add(member);
            }
            project.setMembers(members);
        }
        
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectRequest projectRequest) {
        Project project = getProjectById(id);
        
        if (projectRequest.getName() != null) {
            project.setName(projectRequest.getName());
        }
        if (projectRequest.getDescription() != null) {
            project.setDescription(projectRequest.getDescription());
        }
        if (projectRequest.getStatus() != null) {
            project.setStatus(projectRequest.getStatus());
        }
        if (projectRequest.getStartDate() != null) {
            project.setStartDate(projectRequest.getStartDate());
        }
        if (projectRequest.getEndDate() != null) {
            project.setEndDate(projectRequest.getEndDate());
        }
        
        // Update team if provided
        if (projectRequest.getTeamId() != null) {
            Team team = teamRepository.findById(projectRequest.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found with id: " + projectRequest.getTeamId()));
            project.setTeam(team);
        }
        
        // Update members if provided
        if (projectRequest.getMemberIds() != null) {
            Set<User> members = new HashSet<>();
            for (Long memberId : projectRequest.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + memberId));
                members.add(member);
            }
            project.setMembers(members);
        }
        
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    public Project addMemberToProject(Long projectId, Long userId) {
        Project project = getProjectById(projectId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        project.getMembers().add(user);
        return projectRepository.save(project);
    }

    public Project removeMemberFromProject(Long projectId, Long userId) {
        Project project = getProjectById(projectId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
        
        project.getMembers().remove(user);
        return projectRepository.save(project);
    }
}