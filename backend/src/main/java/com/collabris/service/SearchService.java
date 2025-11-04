package com.collabris.service;

import com.collabris.dto.response.ProjectResponse;
import com.collabris.dto.response.SearchResponse;
import com.collabris.dto.response.TaskResponse;
import com.collabris.dto.response.UserResponse;
import com.collabris.repository.ProjectRepository;
import com.collabris.repository.TaskRepository;
import com.collabris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SearchService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public SearchResponse performSearch(String query) {
        // For now, we run these sequentially. For a high-performance system,
        // these would be run in parallel using CompletableFuture.
        List<ProjectResponse> projects = projectRepository.searchByNameOrDescription(query)
                .stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());

        List<TaskResponse> tasks = taskRepository.searchByTitleOrDescription(query)
                .stream()
                .map(TaskResponse::new)
                .collect(Collectors.toList());

        List<UserResponse> users = userRepository.searchByTerm(query)
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());

        return new SearchResponse(projects, tasks, users);
    }
}