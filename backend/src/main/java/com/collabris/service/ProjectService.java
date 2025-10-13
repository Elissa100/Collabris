package com.collabris.service;

import com.collabris.dto.request.ProjectRequest;
import com.collabris.dto.response.ProjectResponse;
import com.collabris.entity.ChatRoom;
import com.collabris.entity.Project;
import com.collabris.entity.User;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ProjectResponse createProject(ProjectRequest projectRequest, User owner) {
        Project project = new Project();
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        project.setOwner(owner);
        project.addMember(owner);
        
        ChatRoom projectChatRoom = new ChatRoom(
            projectRequest.getName(), 
            "Chat for project: " + projectRequest.getName(),
            ChatRoom.RoomType.PROJECT,
            project,
            owner
        );
        project.setChatRoom(projectChatRoom);

        Project savedProject = projectRepository.save(project);

        // Force Hibernate to load the lazy collections before the session closes
        Hibernate.initialize(savedProject.getOwner());
        Hibernate.initialize(savedProject.getMembers());

        long totalProjects = projectRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalProjects", totalProjects));

        return new ProjectResponse(savedProject);
    }

    public ProjectResponse getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("Project not found with ID: " + projectId));
        // Force initialization before returning
        Hibernate.initialize(project.getOwner());
        Hibernate.initialize(project.getMembers());
        return new ProjectResponse(project);
    }

    public List<ProjectResponse> getProjectsByMemberId(Long userId) {
        List<Project> projects = projectRepository.findByMemberId(userId);
        // Eagerly fetch necessary data within the transaction
        projects.forEach(p -> {
            Hibernate.initialize(p.getOwner());
            Hibernate.initialize(p.getMembers());
        });
        return projects.stream().map(ProjectResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest projectRequest) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        project.setName(projectRequest.getName());
        project.setDescription(projectRequest.getDescription());
        Project savedProject = projectRepository.save(project);
        Hibernate.initialize(savedProject.getOwner());
        Hibernate.initialize(savedProject.getMembers());
        return new ProjectResponse(savedProject);
    }

    @Transactional
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
        long totalProjects = projectRepository.count();
        messagingTemplate.convertAndSend("/topic/dashboard/stats", Map.of("totalProjects", totalProjects));
    }

    @Transactional
    public ProjectResponse addMemberToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        project.addMember(user);
        Project savedProject = projectRepository.save(project);
        Hibernate.initialize(savedProject.getOwner());
        Hibernate.initialize(savedProject.getMembers());
        return new ProjectResponse(savedProject);
    }

    @Transactional
    public ProjectResponse removeMemberFromProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        project.removeMember(user);
        Project savedProject = projectRepository.save(project);
        Hibernate.initialize(savedProject.getOwner());
        Hibernate.initialize(savedProject.getMembers());
        return new ProjectResponse(savedProject);
    }
}