// File path: frontend/src/pages/Projects/ProjectDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Alert, Paper, Grid, Avatar, List, ListItem,
    ListItemAvatar, ListItemText, Divider, Chip, TextField, IconButton
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import Layout from '../../components/Layout/Layout';
import { getProjectById } from '../../services/projectService';
import { getProjectMessages } from '../../services/chatService';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null); // Ref to scroll to bottom

    // Effect to scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Effect for fetching initial project and message data
    useEffect(() => {
        const fetchAllData = async () => {
            if (!projectId) return;
            try {
                setLoading(true);
                setError(null);
                const [projectData, messagesData] = await Promise.all([
                    getProjectById(projectId),
                    getProjectMessages(projectId)
                ]);
                setProject(projectData);
                setMessages(messagesData);
            } catch (err) {
                console.error("Failed to fetch project data:", err);
                setError("Could not load the project.");
                toast.error("Failed to load project details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [projectId]);

    // Effect for managing WebSocket connection
    useEffect(() => {
        if (!projectId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = () => {};

        stompClient.current.connect({}, () => {
            console.log("Chat WebSocket Connected!");
            stompClient.current.subscribe(`/topic/project/${projectId}/chat`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                // Add the new message to the state
                setMessages(prevMessages => [...prevMessages, receivedMessage]);
            });
        });

        // Cleanup on component unmount
        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
                console.log("Chat WebSocket Disconnected.");
            }
        };
    }, [projectId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && stompClient.current) {
            const chatMessage = {
                content: newMessage,
            };
            stompClient.current.send(`/app/chat/${projectId}/sendMessage`, {}, JSON.stringify(chatMessage));
            setNewMessage("");
        }
    };

    if (loading) { /* ... same as before */ }
    if (error) { /* ... same as before */ }
    if (!project) { /* ... same as before */ }

    return (
        <Layout>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">{project.name}</Typography>
                <Typography color="text.secondary">{project.description}</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* --- THE NEW CHAT INTERFACE --- */}
                    <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Project Chat</Typography>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                            {messages.map(msg => (
                                <Box key={msg.id} sx={{ display: 'flex', mb: 2 }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light' }}>
                                        {msg.sender?.firstName?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            {msg.sender.firstName} {msg.sender.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </Typography>
                                        <Typography variant="body2">{msg.content}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>
                        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <IconButton type="submit" color="primary">
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    {/* ... Members list remains the same ... */}
                </Grid>
            </Grid>
        </Layout>
    );
};

export default ProjectDetailPage;