// File path: frontend/src/services/notificationService.ts
import apiClient from './apiClient';
import { Notification } from '../types';

/**
 * Fetches all notifications for the currently authenticated user.
 * Corresponds to: GET /api/notifications
 */
export const getNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/api/notifications');
    return response;
};

/**
 * Marks a single notification as read.
 * Corresponds to: PATCH /api/notifications/{notificationId}/read
 * @param notificationId The ID of the notification to mark as read.
 */
export const markAsRead = async (notificationId: number): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(`/api/notifications/${notificationId}/read`);
    return response;
};

/**
 * Marks all of the user's notifications as read.
 * (Note: We will need to add a backend endpoint for this later if desired,
 * for now, this would be handled client-side or by multiple single requests).
 */
// Placeholder for a future enhancement
// export const markAllAsRead = async (): Promise<any> => {
//   const response = await apiClient.post('/api/notifications/mark-all-read');
//   return response.data;
// };