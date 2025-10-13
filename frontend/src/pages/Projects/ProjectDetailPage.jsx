// File Path: frontend/src/pages/Projects/ProjectDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Alert, Paper, Grid,
    Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Chip
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import { getProjectById } from '../../services/projectService';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                setLoading(true);
                setError(null);
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

    // --- THIS IS THE FINAL FIX ---
    // If we are loading OR if there is an error, we show those states first.
    // This prevents the component from trying to render "project.name" when project is null.
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

    // Only try to render the main content if the project object actually exists.
    if (!project) {
        return <Layout><Alert severity="warning" sx={{ m: 2 }}>Project not found.</Alert></Layout>;
    }

    return (
        <Layout>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">{project.name}</Typography>
                <Typography color="text.secondary">{project.description}</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, minHeight: 400 }}>
                        <Typography variant="h6">Project Workspace</Typography>
                        <Typography color="text.secondary">(Tasks and Chat will be implemented here)</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Members ({project.members?.length || 0})</Typography>
                        <Divider />
                        <List>
                            {/* Safety check for members array */}
                            {project.members && project.members.map(member => (
                                <ListItem key={member.id}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {member.firstName?.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${member.firstName} ${member.lastName}`}
                                        secondary={`@${member.username}`}
                                    />
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