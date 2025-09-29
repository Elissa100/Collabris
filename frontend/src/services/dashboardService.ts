import apiClient from './apiClient';
import { DashboardStats, Activity } from '../types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
  return response;
};

export const getAdminDashboardStats = async (): Promise<DashboardStats & {
  systemHealth: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  recentActivities: Activity[];
  topPerformers: {
    userId: number;
    name: string;
    score: number;
  }[];
}> => {
  const response = await apiClient.get('/api/dashboard/admin/stats');
  return response;
};

export const getUserDashboardStats = async (): Promise<{
  myProjects: number;
  myTasks: number;
  completedTasks: number;
  myTeams: number;
  unreadMessages: number;
  upcomingDeadlines: {
    projectId: number;
    projectName: string;
    deadline: string;
  }[];
  recentActivities: Activity[];
}> => {
  const response = await apiClient.get('/api/dashboard/user/stats');
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

export const getAnalytics = async (timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<{
  userGrowth: { date: string; count: number }[];
  projectProgress: { date: string; completed: number; created: number }[];
  teamActivity: { date: string; messages: number; tasks: number }[];
  systemUsage: { date: string; activeUsers: number; requests: number }[];
}> => {
  const response = await apiClient.get(`/api/dashboard/analytics?range=${timeRange}`);
  return response;
};

export const getUserPerformance = async (userId?: number): Promise<{
  tasksCompleted: number;
  averageCompletionTime: number;
  projectsContributed: number;
  messagesPosted: number;
  performanceScore: number;
  productivityTrend: { date: string; score: number }[];
}> => {
  const url = userId ? `/api/dashboard/performance/${userId}` : '/api/dashboard/performance/me';
  const response = await apiClient.get(url);
  return response;
};

export const getTeamPerformance = async (teamId: number): Promise<{
  teamId: number;
  teamName: string;
  totalMembers: number;
  activeMembers: number;
  projectsCompleted: number;
  averageProjectDuration: number;
  teamProductivity: number;
  memberPerformance: {
    userId: number;
    name: string;
    productivity: number;
    tasksCompleted: number;
  }[];
}> => {
  const response = await apiClient.get(`/api/dashboard/team/${teamId}/performance`);
  return response;
};

export const exportDashboardData = async (type: 'stats' | 'activities' | 'analytics', format: 'csv' | 'xlsx'): Promise<Blob> => {
  const response = await apiClient.get(`/api/dashboard/export/${type}?format=${format}`, {
    responseType: 'blob',
  });
  return response;
};

export const getNotifications = async (limit: number = 5): Promise<{
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}[]> => {
  const response = await apiClient.get(`/api/dashboard/notifications?limit=${limit}`);
  return response;
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await apiClient.patch(`/api/dashboard/notifications/${notificationId}/read`);
};

export const getUpcomingEvents = async (limit: number = 5): Promise<{
  id: number;
  title: string;
  type: 'meeting' | 'deadline' | 'milestone';
  date: string;
  projectId?: number;
  projectName?: string;
}[]> => {
  const response = await apiClient.get(`/api/dashboard/events/upcoming?limit=${limit}`);
  return response;
};
