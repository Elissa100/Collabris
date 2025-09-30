import apiClient from './apiClient';
import { endpoints } from '../config/environment';
import { Team, TeamRequest, User, PaginationParams, PaginatedResponse } from '../types';

export const getAllTeams = async (params?: PaginationParams): Promise<PaginatedResponse<Team>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.direction) queryParams.append('direction', params.direction);

  const url = `${endpoints.teams.getAll}?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<Team>>(url);
  return response;
};

export const getTeamById = async (id: number): Promise<Team> => {
  const response = await apiClient.get<Team>(endpoints.teams.getById(id));
  return response;
};

export const createTeam = async (teamData: TeamRequest): Promise<Team> => {
  const response = await apiClient.post<Team>(endpoints.teams.create, teamData);
  return response;
};

export const updateTeam = async (id: number, teamData: Partial<TeamRequest>): Promise<Team> => {
  const response = await apiClient.put<Team>(endpoints.teams.update(id), teamData);
  return response;
};

export const deleteTeam = async (id: number): Promise<void> => {
  await apiClient.delete(endpoints.teams.delete(id));
};

export const addTeamMember = async (teamId: number, userId: number): Promise<void> => {
  await apiClient.post(endpoints.teams.addMember(teamId, userId));
};

export const removeTeamMember = async (teamId: number, userId: number): Promise<void> => {
  await apiClient.delete(endpoints.teams.removeMember(teamId, userId));
};

export const getTeamMembers = async (teamId: number): Promise<User[]> => {
  const response = await apiClient.get<User[]>(`/api/teams/${teamId}/members`);
  return response;
};

export const getUserTeams = async (userId?: number): Promise<Team[]> => {
  const url = userId ? `/api/teams/user/${userId}` : '/api/teams/my-teams';
  const response = await apiClient.get<Team[]>(url);
  return response;
};

export const searchTeams = async (query: string, params?: PaginationParams): Promise<PaginatedResponse<Team>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());

  const url = `${endpoints.teams.getAll}/search?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<Team>>(url);
  return response;
};

export const getTeamStats = async (): Promise<{
  totalTeams: number;
  averageTeamSize: number;
  teamsCreatedThisMonth: number;
  teamsBySize: { size: string; count: number }[];
}> => {
  const response = await apiClient.get('/api/teams/stats');
  return response;
};

export const bulkAddMembers = async (teamId: number, userIds: number[]): Promise<void> => {
  await apiClient.post(`/api/teams/${teamId}/members/bulk`, { userIds });
};

export const bulkRemoveMembers = async (teamId: number, userIds: number[]): Promise<void> => {
  await apiClient.delete(`/api/teams/${teamId}/members/bulk`, { data: { userIds } });
};
