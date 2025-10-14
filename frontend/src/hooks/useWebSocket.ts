import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useAppSelector } from "../store/store";
import { selectToken } from "../store/slices/authSlice"; 

const useWebSocket = (url: string) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const token = useAppSelector(selectToken); // Get the auth token from Redux

  const subscribe = useCallback((destination: string, callback: (msg: IMessage) => void): StompSubscription | null => {
    if (clientRef.current?.connected) {
      console.log(`[WebSocket] Subscribing to ${destination}`);
      return clientRef.current.subscribe(destination, callback);
    }
    console.warn(`[WebSocket] Cannot subscribe. Client not connected.`);
    return null;
  }, []);

  const sendMessage = (destination: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.error("[WebSocket] Cannot send message. Client not connected.");
    }
  };

  useEffect(() => {
    // Don't try to connect if there's no token
    if (!token) {
        console.log("[WebSocket] No auth token found. Connection delayed.");
        return;
    }

    const stompClient = new Client({
      brokerURL: url.replace("http", "ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[WebSocket] ✅ Connected");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("[WebSocket] ❌ Disconnected");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("[WebSocket] STOMP error:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: () => {
        console.log("[WebSocket] 🔌 Connection closed");
        setConnected(false);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      console.log("🧹 Cleaning up WebSocket connection...");
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [url, token]);

  return { connected, sendMessage, subscribe };
};

export default useWebSocket;