// File path: frontend/src/services/projectService.ts
import apiClient from './apiClient';
import { Project, ProjectRequest } from '../types';

// This is the new function to fetch the user's projects
export const getMyProjects = async (): Promise<Project[]> => {
    // This calls the GET /api/projects endpoint we secured in the last step
    const response = await apiClient.get('/api/projects');
    return response;
};

// These functions will be used when we build the project creation/editing modals
export const createProject = async (projectData: ProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/api/projects', projectData);
    return response;
};

export const updateProject = async (projectId: number, projectData: ProjectRequest): Promise<Project> => {
    const response = await apiClient.put(`/api/projects/${projectId}`, projectData);
    return response;
};

export const deleteProject = async (projectId: number): Promise<void> => {
    const response = await apiClient.delete(`/api/projects/${projectId}`);
    return response;
};

export const getProjectById = async (projectId: number): Promise<Project> => {
    const response = await apiClient.get(`/api/projects/${projectId}`);
    return response;
};