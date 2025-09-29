import apiClient from './apiClient';
import { endpoints } from '../config/environment';
import { User, PaginationParams, PaginatedResponse } from '../types';

export const getAllUsers = async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.direction) queryParams.append('direction', params.direction);

  const url = `${endpoints.users.getAll}?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<User>>(url);
  return response;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(endpoints.users.getById(id));
  return response;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await apiClient.put<User>(endpoints.users.update(id), userData);
  return response;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(endpoints.users.delete(id));
};

export const uploadUserAvatar = async (id: number, file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.upload(endpoints.users.uploadAvatar(id), formData, onProgress);
  return response.avatarUrl || response.url;
};

export const searchUsers = async (query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());

  const url = `${endpoints.users.getAll}/search?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<User>>(url);
  return response;
};

export const getUserStats = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: { role: string; count: number }[];
}> => {
  const response = await apiClient.get('/api/users/stats');
  return response;
};

export const bulkUpdateUsers = async (userIds: number[], updates: Partial<User>): Promise<void> => {
  await apiClient.put('/api/users/bulk', { userIds, updates });
};

export const exportUsers = async (format: 'csv' | 'xlsx'): Promise<Blob> => {
  const response = await apiClient.get(`/api/users/export?format=${format}`, {
    responseType: 'blob',
  });
  return response;
};
