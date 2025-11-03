import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Tabs, Tab, Button, Paper } from "@mui/material";
import { Add as AddIcon } from '@mui/icons-material';
import toast from "react-hot-toast";

// --- Redux Imports ---
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchMessagesForProject } from "../../store/slices/chatSlice";
import { fetchTasksForProject, createNewTask, updateExistingTask, selectTasksForProject, selectTasksLoadingStatus } from "../../store/slices/taskSlice";

// --- Type Imports ---
import { Project, Task, TaskRequest } from "../../types"; // <-- Import TaskRequest

// --- Service and Component Imports ---
import { getProjectById, addMemberToProject, removeMemberFromProject } from "../../services/projectService";
import Layout from "../../components/Layout/Layout";
import KanbanBoard from "./KanbanBoard";
import TaskModal from "./TaskModal";
import ProjectMembersManager from "./ProjectMembersManager";
import ChatView from "./Chat/ChatView";

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();

    const [project, setProject] = useState<Project | null>(null);
    const [loadingProject, setLoadingProject] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const tasks = useAppSelector(selectTasksForProject(projectId!));
    const tasksLoading = useAppSelector(selectTasksLoadingStatus) === 'loading';

    const fetchProjectDetails = useCallback(async () => {
        if (!projectId) return;
        setLoadingProject(true);
        try {
            const projectData = await getProjectById(projectId);
            setProject(projectData);
        } catch (error) {
            toast.error("Failed to load project details.");
        } finally {
            setLoadingProject(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            dispatch(fetchTasksForProject(projectId));
            dispatch(fetchMessagesForProject(projectId));
            fetchProjectDetails();
        }
    }, [projectId, dispatch, fetchProjectDetails]);
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);
    const handleOpenTaskModal = (task: Task | null = null) => { setEditingTask(task); setTaskModalOpen(true); };
    
    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setEditingTask(null);
        if(projectId) dispatch(fetchTasksForProject(projectId));
    };

    // --- CORRECTED HANDLERS ---
    const handleSaveTask = (taskData: Partial<TaskRequest>, taskId?: number) => {
        if (!projectId) return;

        if (taskId) {
            // This is an update
            dispatch(updateExistingTask({ taskId, taskData, projectId }))
                .unwrap()
                .then(() => toast.success("Task updated!"))
                .catch((err) => toast.error(`Failed to update task: ${err.message}`));
        } else {
            // This is a creation
            dispatch(createNewTask({ projectId, taskData: taskData as TaskRequest })) // Assert type for creation
                .unwrap()
                .then(() => toast.success("Task created!"))
                .catch((err) => toast.error(`Failed to create task: ${err.message}`));
        }
        handleCloseTaskModal();
    };

    const handleTaskUpdate = (taskId: number, taskData: Partial<TaskRequest>) => {
        if (!projectId) return;
        dispatch(updateExistingTask({ taskId, taskData, projectId }))
            .unwrap()
            .then(() => toast.success("Task status updated!"))
            .catch((err) => toast.error(`Failed to update task: ${err.message}`));
    };
    
    const handleAddMember = async (userId: number) => { if(projectId) { await addMemberToProject(projectId, userId); await fetchProjectDetails(); }};
    const handleRemoveMember = async (userId: number) => { if(projectId) { await removeMemberFromProject(projectId, userId); await fetchProjectDetails(); }};

    if (loadingProject || !project) {
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
                    {activeTab === 0 && <Button startIcon={<AddIcon />} onClick={() => handleOpenTaskModal(null)} sx={{ mr: 1 }}>Add Task</Button>}
                </Box>
                <Box sx={{ height: 'calc(100vh - 260px)' }}>
                    {activeTab === 0 && (
                        tasksLoading && tasks.length === 0 ?
                        <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} /> : 
                        <KanbanBoard tasks={tasks} projectMembers={project.members} onTaskUpdate={handleTaskUpdate} onTaskClick={handleOpenTaskModal} />
                    )}
                    {activeTab === 1 && <ChatView projectId={projectId!} />}
                    {activeTab === 2 && <ProjectMembersManager project={project} onAddMember={handleAddMember} onRemoveMember={handleRemoveMember} />}
                </Box>
            </Paper>

            <TaskModal open={isTaskModalOpen} onClose={handleCloseTaskModal} onSave={handleSaveTask} task={editingTask} projectMembers={project.members} allProjectTasks={tasks} />
        </Layout>
    );
};

export default ProjectDetailPage;