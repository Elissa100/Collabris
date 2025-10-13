// File path: frontend/src/pages/Projects/ProjectDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Alert, Paper, Grid, Avatar, List, ListItem,
    ListItemAvatar, ListItemText, Divider, Chip, TextField, IconButton
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import Layout from '../../components/Layout/Layout';
import { getProjectById } from '../../services/projectService';
import { getProjectMessages } from '../../services/chatService'; // This import will now succeed

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
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

    useEffect(() => {
        if (!projectId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            debug: () => {},
        });

        client.onConnect = (frame) => {
            console.log('Chat WebSocket Connected!');
            client.subscribe(`/topic/project/${projectId}/chat`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages(prevMessages => [...prevMessages, receivedMessage]);
            });
        };
        
        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                console.log("Chat WebSocket Disconnected.");
            }
        };
    }, [projectId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && stompClientRef.current?.active) {
            const chatMessage = {
                content: newMessage,
            };
            stompClientRef.current.publish({
                destination: `/app/chat/${projectId}/sendMessage`,
                body: JSON.stringify(chatMessage),
            });
            setNewMessage("");
        }
    };

    if (loading) {
        return <Layout><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></Layout>;
    }
    if (error) {
        return <Layout><Alert severity="error">{error}</Alert></Layout>;
    }
    if (!project) {
        return <Layout><Alert severity="warning">Project not found.</Alert></Layout>;
    }

    return (
        <Layout>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">{project.name}</Typography>
                <Typography color="text.secondary">{project.description}</Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Project Chat</Typography>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1 }}>
                            {messages.map(msg => (
                                <Box key={msg.id} sx={{ display: 'flex', mb: 2 }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light' }}>
                                        {msg.sender?.firstName?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            {msg.sender?.firstName} {msg.sender?.lastName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>
                        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', mt: 'auto' }}>
                            <TextField fullWidth variant="outlined" size="small" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            <IconButton type="submit" color="primary"><SendIcon /></IconButton>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Members ({project.members?.length || 0})</Typography>
                        <Divider />
                        <List>
                            {project.members && project.members.map(member => (
                                <ListItem key={member.id}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${member.firstName} ${member.lastName}`} secondary={`@${member.username}`} />
                                    {member.id === project.owner?.id && <Chip label="Owner" size="small" variant="outlined" />}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default ProjectDetailPage;