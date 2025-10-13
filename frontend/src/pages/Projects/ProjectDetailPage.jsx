import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "../../hooks/useWebSocket";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // stable message handler
  const handleMessage = useCallback(
    (msg) => {
      try {
        const body = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      } catch (err) {
        console.error("[WebSocket] Invalid message", err);
      }
    },
    []
  );

  const { connected, sendMessage } = useWebSocket("ws://localhost:8080/ws", handleMessage);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage("/app/chat.sendMessage", {
        projectId: id,
        content: input,
      });
      setInput("");
    }
  };

  useEffect(() => {
    console.log("[WebSocket] ProjectDetail mounted");
    return () => console.log("🧹 Cleaning up WebSocket...");
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Project Chat (ID: {id})</h2>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <div
        style={{
          height: "300px",
          border: "1px solid #ccc",
          overflowY: "auto",
          marginBottom: "1rem",
          padding: "0.5rem",
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>{m.content}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={!connected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
