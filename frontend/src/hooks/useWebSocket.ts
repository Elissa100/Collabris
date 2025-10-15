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
    // --- THIS IS THE CRITICAL FIX ---
    // If there's no token, do not attempt to connect.
    if (!token) {
        console.log("[WebSocket] No token found. Connection attempt deferred.");
        // If there's an existing, old client, deactivate it.
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            setConnected(false);
        }
        return; // Stop here.
    }
    // --- END OF FIX ---

    // If there's already an active client, don't create a new one.
    if (clientRef.current) {
        return;
    }

    const stompClient = new Client({
      // We will now connect directly, bypassing the Vite proxy for more stability.
      brokerURL: url.replace("http", "ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[WebSocket] ✅ Connected successfully.");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("[WebSocket] ❌ Disconnected.");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("[WebSocket] Broker reported error:", frame.headers['message']);
        console.error("Additional details:", frame.body);
      },
      onWebSocketClose: (event) => {
        console.log("[WebSocket] 🔌 Connection closed.", event);
        setConnected(false);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      console.log("🧹 Cleaning up WebSocket connection...");
      if (clientRef.current?.active) {
          clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [url, token]); // The hook now correctly re-evaluates when the token becomes available.

  return { connected, sendMessage, subscribe };
};

export default useWebSocket;