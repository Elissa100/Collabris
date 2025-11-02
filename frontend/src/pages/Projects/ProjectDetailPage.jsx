import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, TextField, IconButton, Tabs, Tab, Button, Paper } from "@mui/material";
import { Send as SendIcon, Add as AddIcon } from '@mui/icons-material';
import toast from "react-hot-toast";

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from "../../store/store";
import { selectUser } from "../../store/slices/authSlice";
import {
    fetchMessagesForProject,
    addMessage,
    selectMessagesForProject,
} from "../../store/slices/chatSlice";
import { fetchTasksForProject, createNewTask, updateExistingTask, selectTasksForProject, selectTasksLoadingStatus } from "../../store/slices/taskSlice";

// --- Service, Hook, and Component Imports ---
import { getProjectById, addMemberToProject, removeMemberFromProject } from "../../services/projectService";
import useWebSocket from "../../hooks/useWebSocket";
import Layout from "../../components/Layout/Layout";
import KanbanBoard from "./KanbanBoard";
import TaskModal from "./TaskModal";
import ProjectMembersManager from "./ProjectMembersManager";

// --- ChatView Component (UNMODIFIED) ---
const ChatView = ({ projectId }) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectUser);
    const messages = useAppSelector(selectMessagesForProject(projectId));
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const { connected, sendMessage, subscribe } = useWebSocket("http://localhost:8080/ws");

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

// --- Main Page Component (MODIFIED) ---
const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const tasks = useAppSelector(selectTasksForProject(projectId));
    const tasksLoading = useAppSelector(selectTasksLoadingStatus) === 'loading';
    
    const fetchProjectData = useCallback(async () => {
        if (projectId) {
            try {
                const projectData = await getProjectById(projectId);
                setProject(projectData);
            } catch (error) {
                toast.error("Failed to load project details.");
            }
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            dispatch(fetchMessagesForProject(projectId));
            dispatch(fetchTasksForProject(projectId));
            fetchProjectData();
        }
    }, [projectId, dispatch, fetchProjectData]);

    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    // MODIFIED: This is now also used for opening the modal to EDIT a task
    const handleOpenTaskModal = (task = null) => {
        setEditingTask(task);
        setTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setEditingTask(null);
    };

    const handleSaveTask = (taskData, taskId) => {
        const action = taskId
            ? updateExistingTask({ taskId, taskData, projectId })
            : createNewTask({ projectId, taskData });

        dispatch(action)
            .unwrap()
            .then(() => toast.success(`Task ${taskId ? 'updated' : 'created'}!`))
            .catch((err) => toast.error(`Failed to save task: ${err.message}`));
        
        handleCloseTaskModal();
    };

    const handleTaskUpdate = (taskId, taskData) => {
        dispatch(updateExistingTask({ taskId, taskData, projectId }))
            .unwrap()
            .then(() => toast.success(`Task status updated!`))
            .catch((err) => toast.error(`Failed to update task: ${err.message}`));
    };

    const handleAddMember = async (userId) => {
        await addMemberToProject(projectId, userId);
        await fetchProjectData();
    };

    const handleRemoveMember = async (userId) => {
        await removeMemberFromProject(projectId, userId);
        await fetchProjectData();
    };

    if (!project) {
        return <Layout><CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} /></Layout>;
    }

    return (
        <Layout>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">{project.name}</Typography>
                <Typography variant="body1" color="text.secondary">{project.description}</Typography>
            </Box>
            
            <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p:1 }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Tasks" />
                        <Tab label="Chat" />
                        <Tab label="Members" />
                    </Tabs>
                    {activeTab === 0 && (
                         <Button startIcon={<AddIcon />} onClick={() => handleOpenTaskModal(null)} sx={{ mr: 1 }}>
                            Add Task
                        </Button>
                    )}
                </Box>

                <Box sx={{ height: 'calc(100vh - 260px)' }}>
                    {activeTab === 0 && (tasksLoading ? <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} /> : 
                        <KanbanBoard 
                            tasks={tasks} 
                            projectMembers={project.members} 
                            onTaskUpdate={handleTaskUpdate}
                            onTaskClick={handleOpenTaskModal} // <-- PASS THE HANDLER
                        />
                    )}
                    {activeTab === 1 && <ChatView projectId={projectId} />}
                    {activeTab === 2 && (
                        <ProjectMembersManager 
                            project={project}
                            onAddMember={handleAddMember}
                            onRemoveMember={handleRemoveMember}
                        />
                    )}
                </Box>
            </Paper>

            <TaskModal
                open={isTaskModalOpen}
                onClose={handleCloseTaskModal}
                onSave={handleSaveTask}
                task={editingTask}
                projectMembers={project.members}
            />
        </Layout>
    );
};

export default ProjectDetailPage;