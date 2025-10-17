import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useAppSelector } from "../store/store";
import { selectToken } from "../store/slices/authSlice";

const useWebSocket = (url: string) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const token = useAppSelector(selectToken);

  const subscribe = useCallback((destination: string, callback: (msg: IMessage) => void): StompSubscription | null => {
    if (clientRef.current?.connected) {
      return clientRef.current.subscribe(destination, callback);
    }
    return null;
  }, []);

  const sendMessage = (destination: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  };

  useEffect(() => {
    if (!token) {
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            setConnected(false);
        }
        return;
    }
    
    if (clientRef.current) {
        return;
    }

    const brokerURL = url.replace("http", "ws");

    const stompClient = new Client({
      brokerURL: brokerURL, 
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // --- THIS IS THE FIX ---
      // We ensure the URL is a valid string before passing it to the WebSocket constructor.
      webSocketFactory: () => {
          if (!stompClient.brokerURL) {
              // This should ideally never happen, but it satisfies TypeScript's safety checks.
              throw new Error("WebSocket broker URL is not set.");
          }
          return new WebSocket(stompClient.brokerURL);
      },
      // --- END OF FIX ---
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[WebSocket] ✅ NATIVE CONNECTION ESTABLISHED.");
        setConnected(true);
      },
      onStompError: (frame) => {
        console.error("[WebSocket] Broker reported error:", frame.headers['message']);
        console.error("Additional details:", frame.body);
      },
      onWebSocketClose: (event) => {
        console.log("[WebSocket] 🔌 Native connection closed.", event);
        setConnected(false);
      },
      onWebSocketError: (error) => {
        console.error("[WebSocket] Connection Error:", error);
      }
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      if (clientRef.current?.active) {
          clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [url, token]);

  return { connected, sendMessage, subscribe };
};

export default useWebSocket;