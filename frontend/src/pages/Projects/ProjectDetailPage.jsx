import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, TextField, IconButton } from "@mui/material";
import { Send as SendIcon } from '@mui/icons-material';
import toast from "react-hot-toast";

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from "../../store/store";
import { selectUser } from "../../store/slices/authSlice";
import { 
    fetchMessagesForProject, 
    addMessage, 
    selectMessagesForProject, 
    selectChatLoadingStatus 
} from "../../store/slices/chatSlice";

// --- Service and Hook Imports ---
import useWebSocket from "../../hooks/useWebSocket";
import Layout from "../../components/Layout/Layout";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();

  // --- Get data from Redux store ---
  const currentUser = useAppSelector(selectUser);
  const messages = useAppSelector(selectMessagesForProject(projectId));
  const loadingStatus = useAppSelector(selectChatLoadingStatus);

  // --- Local state for input only ---
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { connected, sendMessage, subscribe } = useWebSocket("ws://localhost:8080/ws");

  // --- Effect to fetch initial messages (will only fetch if not in store) ---
  useEffect(() => {
    if (projectId) {
      dispatch(fetchMessagesForProject(projectId));
    }
  }, [projectId, dispatch]);

  // --- Callback for incoming WebSocket messages ---
  const handleIncomingMessage = useCallback((msg) => {
    try {
      const body = JSON.parse(msg.body);
      if (body.sender.id === currentUser?.id) return; // Don't re-add our own messages
      
      // Dispatch action to add the new message to the Redux store
      dispatch(addMessage({ projectId, message: body }));

    } catch (err) {
      console.error("[WebSocket] Could not parse incoming message:", err);
    }
  }, [projectId, currentUser?.id, dispatch]);

  // --- Subscribe to WebSocket topic ---
  useEffect(() => {
    if (connected && projectId) {
      const destination = `/topic/project/${projectId}/chat`;
      const subscription = subscribe(destination, handleIncomingMessage);
      return () => subscription?.unsubscribe();
    }
  }, [connected, projectId, subscribe, handleIncomingMessage]);
  
  // --- Auto-scroll on new messages ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handle sending a message ---
  const handleSend = () => {
    if (!input.trim() || !projectId || !currentUser) return;

    // Send to backend via WebSocket
    sendMessage(`/app/chat/${projectId}/sendMessage`, { content: input });

    // Optimistically add to Redux store
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: currentUser,
      content: input,
      timestamp: new Date().toISOString(), // Use ISO string for consistency
    };
    dispatch(addMessage({ projectId, message: optimisticMessage }));
    
    setInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
  };

  // --- Render logic remains very similar ---
  return (
    <Layout>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Project Chat</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: connected ? 'success.main' : 'error.main' }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'currentColor' }} />
                    <Typography variant="caption">{connected ? "Connected" : "Disconnected"}</Typography>
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {loadingStatus === 'loading' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                        No messages yet. Start the conversation!
                    </Typography>
                ) : (
                    messages.map((msg) => (
                        <Box key={msg.id} sx={{ mb: 2, display: 'flex', justifyContent: msg.sender.id === currentUser?.id ? 'flex-end' : 'flex-start' }}>
                            <Box sx={{ maxWidth: '70%', bgcolor: msg.sender.id === currentUser?.id ? 'primary.main' : 'background.paper', color: msg.sender.id === currentUser?.id ? 'primary.contrastText' : 'text.primary', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>{msg.sender.username}</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7, mt: 0.5 }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                            </Box>
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
                <TextField fullWidth multiline maxRows={4} variant="outlined" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} disabled={!connected} />
                <IconButton color="primary" onClick={handleSend} disabled={!connected || !input.trim()}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    </Layout>
  );
};

export default ProjectDetailPage;