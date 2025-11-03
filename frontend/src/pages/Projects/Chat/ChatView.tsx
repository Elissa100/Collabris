import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, Paper, TextField, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { selectUser } from '../../../store/slices/authSlice';
import { addMessage, selectMessagesForProject } from '../../../store/slices/chatSlice';
import useWebSocket from '../../../hooks/useWebSocket';

interface ChatViewProps {
    projectId: string;
}

const ChatView: React.FC<ChatViewProps> = ({ projectId }) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectUser);
    const messages = useAppSelector(selectMessagesForProject(projectId));
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const { connected, sendMessage, subscribe } = useWebSocket("http://localhost:8080/ws");

    const handleIncomingMessage = useCallback((msg: any) => {
        try {
            const body = JSON.parse(msg.body);
            // Prevent re-adding our own optimistic message
            if (body.sender.id === currentUser?.id) return;
            dispatch(addMessage({ projectId, message: body }));
        } catch (err) {
            console.error("Could not parse incoming message:", err);
        }
    }, [projectId, currentUser?.id, dispatch]);

    useEffect(() => {
        if (connected && projectId) {
            const dest = `/topic/project/${projectId}/chat`;
            const sub = subscribe(dest, handleIncomingMessage);
            return () => {
                sub?.unsubscribe();
            };
        }
    }, [connected, projectId, subscribe, handleIncomingMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !currentUser) return;
        sendMessage(`/app/chat/${projectId}/sendMessage`, { content: input });
        
        // Optimistic update
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            sender: currentUser,
            content: input,
            timestamp: new Date().toISOString()
        };
        // @ts-ignore
        dispatch(addMessage({ projectId, message: optimisticMsg }));
        setInput("");
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {messages.map((msg) => (
                    <Box key={msg.id} sx={{ mb: 2, display: 'flex', justifyContent: msg.sender.id === currentUser?.id ? 'flex-end' : 'flex-start' }}>
                        <Paper elevation={2} sx={{ maxWidth: '70%', bgcolor: msg.sender.id === currentUser?.id ? 'primary.main' : 'background.paper', color: msg.sender.id === currentUser?.id ? 'primary.contrastText' : 'text.primary', p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{msg.sender.username}</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</Typography>
                        </Paper>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, flexShrink: 0 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!connected}
                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                    multiline
                    maxRows={4}
                />
                <IconButton color="primary" onClick={handleSend} disabled={!connected || !input.trim()}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatView;