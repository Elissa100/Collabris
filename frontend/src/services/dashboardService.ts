// File path: frontend/src/services/dashboardService.ts
import apiClient from './apiClient';
import { DashboardStats, Activity } from '../types';

// The generic type <T> in apiClient.get<T> tells the client what shape the "data" property will have.
// The client then returns that data directly.

export const getAdminDashboardStats = async (): Promise<{ totalUsers: number, totalProjects: number, totalTeams: number, roleDistribution: any[], userGrowth: any[] }> => {
  // FIX: The apiClient returns the data directly. We do not need to access a .data property.
  const response = await apiClient.get('/api/dashboard/admin');
  return response;
};

export const getManagerDashboardStats = async (): Promise<{ totalProjects: number, totalTeams: number, tasksCompletedThisWeek: number }> => {
  const response = await apiClient.get('/api/dashboard/manager');
  return response;
};

export const getMemberDashboardStats = async (): Promise<{ myProjects: number, myTeams: number, myTasksDue: number }> => {
  const response = await apiClient.get('/api/dashboard/member');
  return response;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
  return response;
};

export const getRecentActivities = async (limit: number = 10): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>(`/api/dashboard/activities?limit=${limit}`);
  return response;
};

export const getSystemHealth = async (): Promise<{
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeUsers: number;
  requestsPerMinute: number;
}> => {
  const response = await apiClient.get('/api/dashboard/system/health');
  return response;
};