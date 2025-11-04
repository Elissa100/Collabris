package com.collabris.dto.response;

import java.util.List;

public class SearchResponse {
    private List<ProjectResponse> projects;
    private List<TaskResponse> tasks;
    private List<UserResponse> users;

    public SearchResponse(List<ProjectResponse> projects, List<TaskResponse> tasks, List<UserResponse> users) {
        this.projects = projects;
        this.tasks = tasks;
        this.users = users;
    }

    // Getters
    public List<ProjectResponse> getProjects() { return projects; }
    public List<TaskResponse> getTasks() { return tasks; }
    public List<UserResponse> getUsers() { return users; }
}