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
import { getMyProjects } from '../../services/projectService';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
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

        fetchProjects();
    }, []);

    const handleCreateProject = () => {
        // This will open a modal in a future step
        toast.success("Create Project modal coming soon!");
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
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">No projects yet!</Typography>
                    <Typography color="text.secondary">Get started by creating a new project.</Typography>
                </Box>
            );
        }
        return (
            <Grid container spacing={3}>
                {projects.map(project => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <motion.div whileHover={{ y: -5 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2">{project.name}</Typography>
                                    <Typography color="text.secondary">{project.description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" component={Link} to={`/projects/${project.id}`}>View</Button>
                                    {/* Edit button would go here in the future */}
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
                        onClick={handleCreateProject}
                    >
                        Create Project
                    </Button>
                </Box>
                {renderContent()}
            </motion.div>
        </Layout>
    );
};

export default ProjectsPage;