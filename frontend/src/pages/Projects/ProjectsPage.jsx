// File path: frontend/src/pages/Projects/ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, CardActions, Button,
    Typography, CircularProgress, Alert
} from '@mui/material';
import { Add as AddIcon, Folder as FolderIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import { getMyProjects, createProject } from '../../services/projectService';
import ProjectModal from './ProjectModal.jsx';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchProjects = async () => {
        try {
            // No need to set loading to true here, handled in initial load
            const projectsData = await getMyProjects();
            setProjects(projectsData);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Could not load your projects. Please try refreshing the page.");
            toast.error("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchProjects();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveProject = async (projectData) => {
        try {
            await createProject(projectData);
            toast.success("Project created successfully!");
            handleCloseModal();
            // Set loading to true while we re-fetch
            setLoading(true);
            await fetchProjects();
        } catch (error) {
            console.error("Failed to create project:", error);
            toast.error(error.message || "Failed to create project.");
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        if (projects.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', mt: 4, py: 8 }}>
                    <FolderIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                    <Typography variant="h6" mt={2}>No projects yet!</Typography>
                    <Typography color="text.secondary">Get started by creating your first project.</Typography>
                </Box>
            );
        }
        return (
            <Grid container spacing={3}>
                {projects.map(project => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <motion.div whileHover={{ y: -5 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.1)' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">{project.name}</Typography>
                                    {/* Using noWrap to prevent long descriptions from breaking the layout */}
                                    <Typography color="text.secondary" noWrap sx={{height: 20}}>
                                        {project.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" component={Link} to={`/projects/${project.id}`}>View Details</Button>
                                </CardActions>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Layout>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">My Projects</Typography>
                        <Typography color="text.secondary">All projects you are a member of.</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenModal} // <-- This now correctly opens the modal
                    >
                        Create Project
                    </Button>
                </Box>
                {renderContent()}

                <ProjectModal 
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveProject}
                />
            </motion.div>
        </Layout>
    );
};

export default ProjectsPage;