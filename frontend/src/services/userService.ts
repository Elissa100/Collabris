// File path: frontend/src/services/userService.ts
import apiClient from './apiClient';
import { User } from '../types';

// This is the type for the data sent when an admin creates/updates a user
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

// Function to get the currently logged-in user's details
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get('/api/users/me');
    return response;
};

// --- CORRECTED ADMIN FUNCTIONS ---

// Function for an ADMIN to get a list of all users
export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/api/users');
    return response;
};

// Function for an ADMIN to create a new user
export const createUser = async (userData: AdminUserUpdateRequest): Promise<User> => {
    const response = await apiClient.post('/api/users', userData);
    return response;
};

// Function for an ADMIN to update an existing user
export const updateUser = async (userId: number, userData: AdminUserUpdateRequest): Promise<User> => {
    const response = await apiClient.put(`/api/users/${userId}`, userData);
    return response;
};

// Function for an ADMIN to delete a user
export const deleteUser = async (userId: number): Promise<any> => {
    const response = await apiClient.delete(`/api/users/${userId}`);
    return response;
};