import apiClient from './apiClient';
import { endpoints } from '../config/environment';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post(endpoints.auth.signin, credentials);
  return response;
};

export const signup = async (userData: SignupRequest): Promise<{ message: string }> => {
  const response = await apiClient.post(endpoints.auth.signup, userData);
  return response;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/api/users/me');
  return response;
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await apiClient.put('/api/users/me', userData);
  return response;
};

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.upload('/api/users/me/avatar', formData);
  return response.avatarUrl || response.url;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.put('/api/users/me/password', {
    currentPassword,
    newPassword,
  });
  return response;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  apiClient.clearAuthToken();
};
