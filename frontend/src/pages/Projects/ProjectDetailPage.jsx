// File path: frontend/src/pages/Projects/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Alert, Paper, Grid,
    Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import { Folder as FolderIcon, Person as PersonIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import { getProjectById } from '../../services/projectService';

const ProjectDetailPage = () => {
    // useParams hook reads the 'projectId' from the URL (e.g., /projects/1)
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;

            try {
                setLoading(true);
                const projectData = await getProjectById(projectId);
                setProject(projectData);
            } catch (err) {
                console.error("Failed to fetch project details:", err);
                setError("Could not load the project. It may not exist or you may not have access.");
                toast.error("Failed to load project details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading project...</Typography>
                </Box>
            </Layout>
        );
    }

    if (error) {
        return <Layout><Alert severity="error" sx={{ m: 2 }}>{error}</Alert></Layout>;
    }

    if (!project) {
        return <Layout><Alert severity="warning" sx={{ m: 2 }}>Project not found.</Alert></Layout>;
    }

    return (
        <Layout>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">{project.name}</Typography>
                <Typography color="text.secondary">{project.description}</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Main Content Area (Tasks, Chat will go here later) */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, minHeight: 400 }}>
                        <Typography variant="h6">Project Workspace</Typography>
                        <Typography color="text.secondary">(Tasks and Chat will be implemented here)</Typography>
                    </Paper>
                </Grid>

                {/* Right Sidebar with Members List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Members</Typography>
                        <Divider />
                        <List>
                            {project.members && project.members.map(member => (
                                <ListItem key={member.id}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${member.firstName} ${member.lastName}`}
                                        secondary={`@${member.username}`}
                                    />
                                    {/* Show a chip for the project owner */}
                                    {member.id === project.owner?.id && <Chip label="Owner" size="small" />}
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