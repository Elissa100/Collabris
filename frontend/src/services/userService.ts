// File path: frontend/src/services/userService.ts
import apiClient from './apiClient';
import { User } from '../types';

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

export const getCurrentUser = async (): Promise<User> => {
    // FIX: The apiClient returns the data directly. We do not need to access a .data property.
    const response = await apiClient.get('/api/users/me');
    return response;
};

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/api/users');
    return response;
};

export const createUser = async (userData: AdminUserUpdateRequest): Promise<User> => {
    const response = await apiClient.post('/api/users', userData);
    return response;
};

export const updateUser = async (userId: number, userData: AdminUserUpdateRequest): Promise<User> => {
    const response = await apiClient.put(`/api/users/${userId}`, userData);
    return response;
};

export const deleteUser = async (userId: number): Promise<any> => {
    const response = await apiClient.delete(`/api/users/${userId}`);
    return response;
};