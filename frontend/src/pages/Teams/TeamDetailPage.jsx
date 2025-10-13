import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, CircularProgress, Alert, Paper, Grid,
    Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Chip
} from '@mui/material';
import { Group as GroupIcon, Person as PersonIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import { getTeamById } from '../../services/teamService';

const TeamDetailPage = () => {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            if (!teamId) return;
            try {
                setLoading(true);
                setError(null);
                const teamData = await getTeamById(teamId);
                setTeam(teamData);
            } catch (err) {
                console.error("Failed to fetch team details:", err);
                setError("Could not load the team. It may not exist or you may not have access.");
                toast.error("Failed to load team details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [teamId]);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress color="secondary" />
                    <Typography sx={{ ml: 2 }}>Loading team...</Typography>
                </Box>
            </Layout>
        );
    }

    if (error) {
        return <Layout><Alert severity="error" sx={{ m: 2 }}>{error}</Alert></Layout>;
    }

    if (!team) {
        return <Layout><Alert severity="warning" sx={{ m: 2 }}>Team not found.</Alert></Layout>;
    }

    return (
        <Layout>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" color="secondary.main">{team.name}</Typography>
                <Typography color="text.secondary">{team.description}</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Main Content Area (Projects, Chat will go here later) */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, minHeight: 400 }}>
                        <Typography variant="h6">Team Workspace</Typography>
                        <Typography color="text.secondary">(Associated projects and chat will be implemented here)</Typography>
                    </Paper>
                </Grid>

                {/* Right Sidebar with Members List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Members ({team.members?.length || 0})</Typography>
                        <Divider />
                        <List>
                            {team.members && team.members.map(member => (
                                <ListItem key={member.id}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'secondary.light' }}>
                                            {member.firstName?.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${member.firstName} ${member.lastName}`}
                                        secondary={`@${member.username}`}
                                    />
                                    {member.id === team.owner?.id && <Chip label="Owner" size="small" variant="outlined" />}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default TeamDetailPage;