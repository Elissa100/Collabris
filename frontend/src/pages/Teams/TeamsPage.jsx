// File path: frontend/src/pages/Teams/TeamsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, CardActions, Button,
    Typography, CircularProgress, Alert, Avatar, AvatarGroup
} from '@mui/material';
import { Add as AddIcon, Group as GroupIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import { getMyTeams, createTeam } from '../../services/teamService';
import TeamModal from './TeamModal.jsx'; // Note the .jsx extension

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchTeams = async () => {
        try {
            const teamsData = await getMyTeams();
            setTeams(teamsData);
        } catch (err) {
            console.error("Failed to fetch teams:", err);
            setError("Could not load your teams.");
            toast.error("Failed to load teams.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchTeams();
    }, []);

    const handleSaveTeam = async (teamData) => {
        try {
            await createTeam(teamData);
            toast.success("Team created successfully!");
            setIsModalOpen(false);
            setLoading(true);
            await fetchTeams(); // Refresh list
        } catch (error) {
            console.error("Failed to create team:", error);
            toast.error(error.message || "Failed to create team.");
        }
    };

    const renderContent = () => {
        if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
        if (error) return <Alert severity="error">{error}</Alert>;
        if (teams.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', mt: 4, py: 8 }}>
                    <GroupIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                    <Typography variant="h6" mt={2}>No teams yet!</Typography>
                    <Typography color="text.secondary">Create a team to start collaborating.</Typography>
                </Box>
            );
        }
        return (
            <Grid container spacing={3}>
                {teams.map(team => (
                    <Grid item xs={12} sm={6} md={4} key={team.id}>
                        <motion.div whileHover={{ y: -5 }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" color="secondary.main">{team.name}</Typography>
                                    <Typography color="text.secondary" noWrap sx={{mb: 2}}>{team.description || 'No description'}</Typography>
                                    
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="caption" sx={{mr: 1}}>Members:</Typography>
                                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
                                            {team.members && team.members.map(m => (
                                                <Avatar key={m.id} alt={m.username}>{m.firstName?.charAt(0)}</Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    {/* Detail page coming in next step */}
                                    <Button size="small" color="secondary" component={Link} to={`/teams/${team.id}`}>View Team</Button>
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
                        <Typography variant="h4" fontWeight="bold">My Teams</Typography>
                        <Typography color="text.secondary">Teams you are a member of.</Typography>
                    </Box>
                    <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                        Create Team
                    </Button>
                </Box>
                {renderContent()}
                <TeamModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTeam} />
            </motion.div>
        </Layout>
    );
};

export default TeamsPage;