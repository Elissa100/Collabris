// File path: frontend/src/services/userService.ts
import apiClient from './apiClient';
import { User } from '../types';

// This is the shape of the data for the create/update form
export interface AdminUserUpdateRequest {
    id?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    enabled: boolean;
    roles: string[];
}

// Existing function to get the current user
export const getCurrentUser = async (): Promise<User> => {
    return await apiClient.get('/api/users/me');
};

// --- NEW ADMIN FUNCTIONS ---

export const getAllUsers = async (): Promise<User[]> => {
    return await apiClient.get('/api/users');
};

export const createUser = async (userData: AdminUserUpdateRequest): Promise<User> => {
    return await apiClient.post('/api/users', userData);
};

export const updateUser = async (userId: number, userData: AdminUserUpdateRequest): Promise<User> => {
    return await apiClient.put(`/api/users/${userId}`, userData);
};

export const deleteUser = async (userId: number): Promise<any> => {
    return await apiClient.delete(`/api/users/${userId}`);
};