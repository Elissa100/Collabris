import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, TextField, IconButton, Tabs, Tab, Button } from "@mui/material";
import { Send as SendIcon, Add as AddIcon } from '@mui/icons-material';
import toast from "react-hot-toast";

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from "../../store/store";
import { selectUser } from "../../store/slices/authSlice";
import { fetchMessagesForProject, addMessage, selectMessagesForProject } from "../../store/slices/chatSlice";
import { fetchTasksForProject, createNewTask, updateExistingTask, selectTasksForProject, selectTasksLoadingStatus } from "../../store/slices/taskSlice";

// --- Service, Hook, and Component Imports ---
import { getProjectById } from "../../services/projectService";
import useWebSocket from "../../hooks/useWebSocket";
import Layout from "../../components/Layout/Layout";
import KanbanBoard from "./KanbanBoard"; // New
import TaskModal from "./TaskModal"; // New

// Chat Component (extracted for clarity)
const ChatView = ({ projectId }) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectUser);
    const messages = useAppSelector(selectMessagesForProject(projectId));
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const { connected, sendMessage, subscribe } = useWebSocket("ws://localhost:8080/ws");
    
    const handleIncomingMessage = useCallback((msg) => {
        try {
            const body = JSON.parse(msg.body);
            if (body.sender.id === currentUser?.id) return;
            dispatch(addMessage({ projectId, message: body }));
        } catch (err) { console.error("Could not parse incoming message:", err); }
    }, [projectId, currentUser?.id, dispatch]);

    useEffect(() => {
        if (connected && projectId) {
            const dest = `/topic/project/${projectId}/chat`;
            const sub = subscribe(dest, handleIncomingMessage);
            return () => sub?.unsubscribe();
        }
    }, [connected, projectId, subscribe, handleIncomingMessage]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !currentUser) return;
        sendMessage(`/app/chat/${projectId}/sendMessage`, { content: input });
        const optimisticMsg = { id: `temp-${Date.now()}`, sender: currentUser, content: input, timestamp: new Date().toISOString() };
        dispatch(addMessage({ projectId, message: optimisticMsg }));
        setInput("");
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {messages.map((msg) => (
                    <Box key={msg.id} sx={{ mb: 2, display: 'flex', justifyContent: msg.sender.id === currentUser?.id ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{ maxWidth: '70%', bgcolor: msg.sender.id === currentUser?.id ? 'primary.main' : 'background.paper', color: msg.sender.id === currentUser?.id ? 'primary.contrastText' : 'text.primary', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{msg.sender.username}</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                        </Box>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
                <TextField fullWidth placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} disabled={!connected} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                <IconButton color="primary" onClick={handleSend} disabled={!connected || !input.trim()}><SendIcon /></IconButton>
            </Box>
        </Box>
    );
};


// Main Page Component
const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);

    const tasks = useAppSelector(selectTasksForProject(projectId));
    const tasksLoading = useAppSelector(selectTasksLoadingStatus) === 'loading';

    // Fetch data on load
    useEffect(() => {
        if (projectId) {
            dispatch(fetchMessagesForProject(projectId));
            dispatch(fetchTasksForProject(projectId));
            getProjectById(projectId).then(setProject).catch(() => toast.error("Failed to load project details."));
        }
    }, [projectId, dispatch]);

    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    const handleSaveTask = (taskData, taskId) => {
        if (taskId) {
            // Update logic here
        } else {
            dispatch(createNewTask({ projectId, taskData }))
                .unwrap()
                .then(() => toast.success("Task created!"))
                .catch((err) => toast.error(`Failed to create task: ${err.message}`));
        }
        setTaskModalOpen(false);
    };

    const handleTaskUpdate = (taskId, taskData) => {
        dispatch(updateExistingTask({ taskId, taskData, projectId }))
            .unwrap()
            .then(() => toast.success(`Task status updated!`))
            .catch((err) => toast.error(`Failed to update task: ${err.message}`));
    };
    
    if (!project) {
        return <Layout><CircularProgress /></Layout>;
    }

    return (
        <Layout>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4">{project.name}</Typography>
                <Typography variant="body1" color="text.secondary">{project.description}</Typography>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Tasks" />
                    <Tab label="Chat" />
                </Tabs>
                {activeTab === 0 && (
                     <Button startIcon={<AddIcon />} onClick={() => setTaskModalOpen(true)} sx={{alignSelf: 'center', mr: 2}}>
                        Add Task
                    </Button>
                )}
            </Box>

            <Box sx={{ height: 'calc(100vh - 250px)' }}>
                {activeTab === 0 && (tasksLoading ? <CircularProgress /> : <KanbanBoard tasks={tasks} projectMembers={project.members} onTaskUpdate={handleTaskUpdate} />)}
                {activeTab === 1 && <ChatView projectId={projectId} />}
            </Box>

            <TaskModal
                open={isTaskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                onSave={handleSaveTask}
                projectMembers={project.members}
            />
        </Layout>
    );
};

export default ProjectDetailPage;