// File path: frontend/src/services/projectService.ts
import apiClient from './apiClient';
import { Project, ProjectRequest } from '../types';

export const getMyProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get('/api/projects');
    return response;
};

export const createProject = async (projectData: ProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/api/projects', projectData);
    return response;
};

export const updateProject = async (projectId: number, projectData: ProjectRequest): Promise<Project> => {
    const response = await apiClient.put(`/api/projects/${projectId}`, projectData);
    return response;
};

export const deleteProject = async (projectId: number): Promise<void> => {
    await apiClient.delete(`/api/projects/${projectId}`);
};

export const getProjectById = async (projectId: number | string): Promise<Project> => {
    const response = await apiClient.get(`/api/projects/${projectId}`);
    return response;
};

// --- NEWLY ADDED FUNCTIONS ---

/**
 * Adds a user to a specific project.
 * Corresponds to: POST /api/projects/{projectId}/members/{userId}
 * @param projectId The ID of the project.
 * @param userId The ID of the user to add.
 */
export const addMemberToProject = async (projectId: number | string, userId: number): Promise<Project> => {
    // The second argument to post is the request body, which is null in this case.
    const response = await apiClient.post(`/api/projects/${projectId}/members/${userId}`, null);
    return response;
};

/**
 * Removes a user from a specific project.
 * Corresponds to: DELETE /api/projects/{projectId}/members/{userId}
 * @param projectId The ID of the project.
 * @param userId The ID of the user to remove.
 */
export const removeMemberFromProject = async (projectId: number | string, userId: number): Promise<Project> => {
    const response = await apiClient.delete(`/api/projects/${projectId}/members/${userId}`);
    return response;
};