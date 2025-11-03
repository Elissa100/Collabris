import apiClient from './apiClient';

/**
 * Adds a dependency to a task.
 * (Task with 'taskId' will be blocked by task with 'dependencyId')
 * @param taskId The ID of the task that will be blocked.
 * @param dependencyId The ID of the task that must be completed first.
 */
export const addDependency = async (taskId: number, dependencyId: number): Promise<any> => {
    const response = await apiClient.post(`/api/tasks/${taskId}/dependencies/${dependencyId}`, null);
    return response;
};

/**
 * Removes a dependency from a task.
 * @param taskId The ID of the task that is currently blocked.
 * @param dependencyId The ID of the blocking task to remove.
 */
export const removeDependency = async (taskId: number, dependencyId: number): Promise<any> => {
    const response = await apiClient.delete(`/api/tasks/${taskId}/dependencies/${dependencyId}`);
    return response;
};