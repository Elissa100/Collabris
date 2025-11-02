// File path: frontend/src/services/activityService.ts
import apiClient from './apiClient';
import { ActivityLog } from '../types';

/**
 * Fetches the global activity feed.
 * Corresponds to: GET /api/activity
 */
export const getActivityFeed = async (): Promise<ActivityLog[]> => {
    const response = await apiClient.get<ActivityLog[]>('/api/activity');
    return response;
};