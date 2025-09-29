import apiClient from './apiClient';
import { endpoints, config } from '../config/environment';
import { ChatRoom, ChatMessage, ChatRoomRequest, ChatMessageRequest, PaginationParams, PaginatedResponse } from '../types';

// WebSocket and STOMP for real-time messaging
let stompClient: any = null;
let socket: any = null;

// Chat API operations
export const getChatRooms = async (params?: PaginationParams): Promise<PaginatedResponse<ChatRoom>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());

  const url = `${endpoints.chat.getRooms}?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<ChatRoom>>(url);
  return response;
};

export const getChatRoomById = async (roomId: number): Promise<ChatRoom> => {
  const response = await apiClient.get<ChatRoom>(`/api/chat/rooms/${roomId}`);
  return response;
};

export const createChatRoom = async (roomData: ChatRoomRequest): Promise<ChatRoom> => {
  const response = await apiClient.post<ChatRoom>(endpoints.chat.createRoom, roomData);
  return response;
};

export const getMessages = async (roomId: number, params?: PaginationParams): Promise<PaginatedResponse<ChatMessage>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());

  const url = `${endpoints.chat.getMessages(roomId)}?${queryParams.toString()}`;
  const response = await apiClient.get<PaginatedResponse<ChatMessage>>(url);
  return response;
};

export const sendMessage = async (messageData: ChatMessageRequest): Promise<ChatMessage> => {
  const response = await apiClient.post<ChatMessage>(endpoints.chat.sendMessage, messageData);
  return response;
};

export const deleteMessage = async (messageId: number): Promise<void> => {
  await apiClient.delete(`/api/chat/messages/${messageId}`);
};

export const editMessage = async (messageId: number, content: string): Promise<ChatMessage> => {
  const response = await apiClient.put<ChatMessage>(`/api/chat/messages/${messageId}`, { content });
  return response;
};

export const markMessageAsRead = async (messageId: number): Promise<void> => {
  await apiClient.patch(`/api/chat/messages/${messageId}/read`);
};

export const getUserChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await apiClient.get<ChatRoom[]>('/api/chat/rooms/my');
  return response;
};

export const addRoomMember = async (roomId: number, userId: number): Promise<void> => {
  await apiClient.post(`/api/chat/rooms/${roomId}/members/${userId}`);
};

export const removeRoomMember = async (roomId: number, userId: number): Promise<void> => {
  await apiClient.delete(`/api/chat/rooms/${roomId}/members/${userId}`);
};

export const leaveRoom = async (roomId: number): Promise<void> => {
  await apiClient.post(`/api/chat/rooms/${roomId}/leave`);
};

// WebSocket operations
export const connectToChat = (onMessageReceived: (message: any) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // For now, we'll use a simple WebSocket implementation
      // In production, you'd want to use SockJS and STOMP
      const token = localStorage.getItem('token');
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      const wsUrl = `${config.wsBaseUrl.replace('http', 'ws')}/ws?token=${token}`;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          onMessageReceived(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };

      socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const disconnectFromChat = (): void => {
  if (socket) {
    socket.close();
    socket = null;
  }
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
};

export const subscribeToRoom = (roomId: number, callback: (message: ChatMessage) => void): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Send subscription message
    socket.send(JSON.stringify({
      action: 'subscribe',
      roomId: roomId
    }));
  }
};

export const unsubscribeFromRoom = (roomId: number): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      action: 'unsubscribe',
      roomId: roomId
    }));
  }
};

export const sendMessageViaWebSocket = (roomId: number, content: string, messageType: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      action: 'sendMessage',
      roomId: roomId,
      content: content,
      messageType: messageType
    }));
  }
};

export const uploadChatFile = async (roomId: number, file: File, onProgress?: (progress: number) => void): Promise<ChatMessage> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('roomId', roomId.toString());
  formData.append('messageType', 'FILE');

  const response = await apiClient.upload('/api/chat/upload', formData, onProgress);
  return response;
};

export const searchMessages = async (query: string, roomId?: number): Promise<ChatMessage[]> => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (roomId) params.append('roomId', roomId.toString());

  const response = await apiClient.get<ChatMessage[]>(`/api/chat/messages/search?${params.toString()}`);
  return response;
};
