// File path: frontend/src/services/teamService.ts
import apiClient from './apiClient';
// FIX: Removed incorrect imports and added the correct ones
import { Team, TeamRequest } from '../types';

export const getMyTeams = async (): Promise<Team[]> => {
    // Calls GET /api/teams to fetch all teams for the current user
    const response = await apiClient.get('/api/teams');
    return response;
};

export const createTeam = async (teamData: TeamRequest): Promise<Team> => {
    // Calls POST /api/teams to create a new team
    const response = await apiClient.post('/api/teams', teamData);
    return response;
};

export const getTeamById = async (teamId: number): Promise<Team> => {
    // Calls GET /api/teams/{teamId} to fetch details for one team
    const response = await apiClient.get(`/api/teams/${teamId}`);
    return response;
};

// Placeholder for future administrative functions
export const updateTeam = async (teamId: number, teamData: TeamRequest): Promise<Team> => {
    const response = await apiClient.put(`/api/teams/${teamId}`, teamData);
    return response;
};

// Placeholder for future administrative functions
export const deleteTeam = async (teamId: number): Promise<void> => {
    const response = await apiClient.delete(`/api/teams/${teamId}`);
    return response;
};