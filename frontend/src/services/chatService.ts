// File path: frontend/src/services/chatService.ts
import apiClient from './apiClient';
import { ChatMessage } from '../types';

export interface ChatMessageRequest {
    content: string;
}

// --- THIS IS THE MISSING FUNCTION, NOW CORRECTLY ADDED BACK ---
export const getProjectMessages = async (projectId: number): Promise<ChatMessage[]> => {
    // This correctly calls the endpoint for fetching a project's message history.
    const response = await apiClient.get(`/api/chat/projects/${projectId}/messages`);
    return response;
};

// This function can be used for fetching messages from non-project chat rooms later.
export const getMessages = async (roomId: number): Promise<ChatMessage[]> => {
  const response = await apiClient.get(`/api/chat/rooms/${roomId}/messages`);
  return response;
};

// This function can be used for sending messages to non-project chat rooms later.
export const sendMessage = async (messageData: { chatRoomId: number; content: string }): Promise<ChatMessage> => {
  const response = await apiClient.post('/api/chat/messages', messageData);
  return response;
};