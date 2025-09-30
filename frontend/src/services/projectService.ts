import apiClient from './apiClient';
import { endpoints } from '../config/environment';
import { Project, ProjectRequest, User, PaginationParams, PaginatedResponse } from '../types';

export const getAllProjects = async (params?: PaginationParams): Promise<PaginatedResponse<Project>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.direction) queryParams.append('direction', params.direction);

  const url = `${endpoints.projects.getAll}?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<Project>>(url);
  return response;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await apiClient.get<Project>(endpoints.projects.getById(id));
  return response;
};

export const createProject = async (projectData: ProjectRequest): Promise<Project> => {
  const response = await apiClient.post<Project>(endpoints.projects.create, projectData);
  return response;
};

export const updateProject = async (id: number, projectData: Partial<ProjectRequest>): Promise<Project> => {
  const response = await apiClient.put<Project>(endpoints.projects.update(id), projectData);
  return response;
};

export const deleteProject = async (id: number): Promise<void> => {
  await apiClient.delete(endpoints.projects.delete(id));
};

export const addProjectMember = async (projectId: number, userId: number): Promise<void> => {
  await apiClient.post(endpoints.projects.addMember(projectId, userId));
};

export const removeProjectMember = async (projectId: number, userId: number): Promise<void> => {
  await apiClient.delete(endpoints.projects.removeMember(projectId, userId));
};

export const getProjectMembers = async (projectId: number): Promise<User[]> => {
  const response = await apiClient.get<User[]>(`/api/projects/${projectId}/members`);
  return response;
};

export const getUserProjects = async (userId?: number): Promise<Project[]> => {
  const url = userId ? `/api/projects/user/${userId}` : '/api/projects/my-projects';
  const response = await apiClient.get<Project[]>(url);
  return response;
};

export const getProjectsByTeam = async (teamId: number): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>(`/api/projects/team/${teamId}`);
  return response;
};

export const searchProjects = async (query: string, params?: PaginationParams): Promise<PaginatedResponse<Project>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());

  const url = `${endpoints.projects.getAll}/search?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<Project>>(url);
  return response;
};

export const getProjectStats = async (): Promise<{
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdue: number;
  projectsByStatus: { status: string; count: number }[];
  projectsByPriority: { priority: string; count: number }[];
}> => {
  const response = await apiClient.get('/api/projects/stats');
  return response;
};

export const updateProjectProgress = async (id: number, progress: number): Promise<Project> => {
  const response = await apiClient.patch<Project>(`/api/projects/${id}/progress`, { progress });
  return response;
};

export const bulkUpdateProjects = async (projectIds: number[], updates: Partial<ProjectRequest>): Promise<void> => {
  await apiClient.put('/api/projects/bulk', { projectIds, updates });
};

export const archiveProject = async (id: number): Promise<void> => {
  await apiClient.patch(`/api/projects/${id}/archive`);
};

export const restoreProject = async (id: number): Promise<void> => {
  await apiClient.patch(`/api/projects/${id}/restore`);
};

export const getProjectAnalytics = async (id: number): Promise<{
  tasksCompleted: number;
  totalTasks: number;
  timeSpent: number;
  teamProductivity: { userId: number; productivity: number }[];
  milestones: { name: string; date: string; completed: boolean }[];
}> => {
  const response = await apiClient.get(`/api/projects/${id}/analytics`);
  return response;
};
