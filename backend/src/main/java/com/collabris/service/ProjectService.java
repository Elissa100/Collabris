// File path: backend/src/main/java/com/collabris/service/ProjectService.java
package com.collabris.service;

import com.collabris.dto.request.ProjectRequest;
import com.collabris.entity.Project;
import com.collabris.entity.User;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Project createProject(ProjectRequest projectRequest, User owner) {
        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setOwner(owner);
        project.addMember(owner);

        Project savedProject = projectRepository.save(project);

        long totalProjects = projectRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalProjects", totalProjects));

        return savedProject;
    }

    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project not found with ID: " + projectId));
    }

    public List<Project> getProjectsByMemberId(Long userId) {
        return projectRepository.findByMemberId(userId);
    }

    public Project updateProject(Long projectId, ProjectRequest projectRequest) {
        Project project = getProjectById(projectId);
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        return projectRepository.save(project);
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);

        long totalProjects = projectRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalProjects", totalProjects));
    }

    public Project addMemberToProject(Long projectId, Long userId) {
        Project project = getProjectById(projectId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        project.addMember(user);
        return projectRepository.save(project);
    }

    public Project removeMemberFromProject(Long projectId, Long userId) {
        Project project = getProjectById(projectId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        project.removeMember(user);
        return projectRepository.save(project);
    }
}