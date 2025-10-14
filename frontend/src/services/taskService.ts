import apiClient from './apiClient';
import { Task, TaskRequest } from '../types';

/**
 * Fetches all tasks for a specific project.
 */
export const getTasksForProject = async (projectId: string | number): Promise<Task[]> => {
    const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
    return response;
};

/**
 * Creates a new task within a project.
 */
export const createTask = async (projectId: string | number, taskData: TaskRequest): Promise<Task> => {
    const response = await apiClient.post(`/api/projects/${projectId}/tasks`, taskData);
    return response;
};

/**
 * Updates an existing task (e.g., its status, title, assignee).
 */
export const updateTask = async (taskId: number, taskData: Partial<TaskRequest>): Promise<Task> => {
    const response = await apiClient.put(`/api/tasks/${taskId}`, taskData);
    return response;
};

/**
 * Deletes a task.
 */
export const deleteTask = async (taskId: number): Promise<void> => {
    await apiClient.delete(`/api/tasks/${taskId}`);
};

/**
 * Fetches all tasks assigned to the currently authenticated user.
 */
export const getMyAssignedTasks = async (): Promise<Task[]> => {
    const response = await apiClient.get('/api/users/me/tasks');
    return response;
};