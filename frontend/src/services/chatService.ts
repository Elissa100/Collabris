import apiClient from './apiClient';
import { ChatMessage } from '../types';

export interface ChatMessageRequest {
    content: string;
}

/**
 * Fetches the message history for a specific project's chat room.
 * @param projectId The ID of the project.
 * @returns A promise that resolves to an array of chat messages.
 */
export const getProjectMessages = async (projectId: number | string): Promise<ChatMessage[]> => {
    const response = await apiClient.get(`/api/chat/projects/${projectId}/messages`);
    return response;
};

/**
 * Fetches messages for a generic chat room (not tied to a project).
 * @param roomId The ID of the chat room.
 * @returns A promise that resolves to an array of chat messages.
 */
export const getMessages = async (roomId: number | string): Promise<ChatMessage[]> => {
  const response = await apiClient.get(`/api/chat/rooms/${roomId}/messages`);
  return response;
};

/**
 * Sends a message to a generic chat room.
 * @param messageData An object containing the chat room ID and message content.
 * @returns A promise that resolves to the saved chat message.
 */
export const sendMessage = async (messageData: { chatRoomId: number; content: string }): Promise<ChatMessage> => {
  const response = await apiClient.post('/api/chat/messages', messageData);
  return response;
};