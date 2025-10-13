import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";

const useWebSocket = (url: string, onMessage: (msg: IMessage) => void) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const connect = () => {
      if (clientRef.current) return; // Prevent duplicate connects

      const stompClient = new Client({
        brokerURL: url.startsWith("ws") ? url : url.replace("http", "ws"),
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("[WebSocket] ✅ Connected");
          setConnected(true);
          setRetryCount(0);
        },
        onDisconnect: () => {
          console.log("[WebSocket] ❌ Disconnected");
          setConnected(false);
        },
        onStompError: (frame) => {
          console.error("[WebSocket] STOMP error:", frame.headers["message"]);
        },
        onWebSocketClose: () => {
          console.log("[WebSocket] 🔌 Closed");
          setConnected(false);

          if (retryCount < MAX_RETRIES) {
            setRetryCount((r) => r + 1);
            console.log(`[WebSocket] Reconnecting... (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(connect, 5000);
          } else {
            console.warn("[WebSocket] Reconnect attempts exceeded. Giving up.");
          }
        },
        onUnhandledMessage: onMessage,
      });

      stompClient.activate();
      clientRef.current = stompClient;
    };

    connect();

    return () => {
      console.log("🧹 Cleaning up WebSocket...");
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [url, onMessage, retryCount]);

  const sendMessage = (destination: string, body: any) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  };

  return { connected, sendMessage };
};

export default useWebSocket;
