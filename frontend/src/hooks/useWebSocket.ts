// frontend/src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client, IMessage, Frame, StompSubscription } from '@stomp/stompjs';
import { updateAdminStats } from '../store/slices/dashboardSlice';

interface AdminStats {
  totalUsers?: number;
  totalProjects?: number;
  totalTeams?: number;
}

const useWebSocket = (): void => {
  const dispatch = useDispatch();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: () => {}, // remove logs
      reconnectDelay: 5000, // reconnect every 5s
    });

    clientRef.current = client;

    const subscribeToStats = () => {
      if (client.connected) {
        subscriptionRef.current = client.subscribe('/topic/dashboard/stats', (message: IMessage) => {
          try {
            const updatedStats: AdminStats = JSON.parse(message.body);
            if (
              updatedStats.totalUsers !== undefined ||
              updatedStats.totalProjects !== undefined ||
              updatedStats.totalTeams !== undefined
            ) {
              dispatch(updateAdminStats(updatedStats));
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        });
      }
    };

    client.onConnect = (frame: Frame) => {
      console.log('Connected to WebSocket:', frame);
      subscribeToStats();
    };

    client.onStompError = (frame: Frame) => {
      console.error('WebSocket STOMP error:', frame.body);
    };

    client.activate(); // starts the connection

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      client.deactivate();
      console.log('Disconnected from WebSocket');
    };
  }, [dispatch]);
};

export default useWebSocket;
