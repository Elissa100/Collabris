// File Path: frontend/src/pages/Dashboard/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Assignment, Group, TrendingUp, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { getManagerDashboardStats } from '../../services/dashboardService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Mock Data for Charts
const projectsStatusData = [ { name: 'On Track', value: 12 }, { name: 'At Risk', value: 3 }, { name: 'Overdue', value: 2 }, ];
const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
const teamPerformanceData = [ { name: 'Frontend', tasks_completed: 45 }, { name: 'Backend', tasks_completed: 62 }, { name: 'Design', tasks_completed: 30 }, { name: 'QA', tasks_completed: 55 }, ];

const ManagerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getManagerDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch manager stats:", error);
                setStats({ totalProjects: 'Error', totalTeams: 'Error', tasksCompletedThisWeek: 'Error' });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <Layout>
                <LoadingSpinner message="Loading Manager Dashboard..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>Manager's Overview</Typography>
                        <Typography variant="body1" color="text.secondary">Monitor team performance and project health across the organization.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />}>Invite User</Button>
                </Box>
                
                <Grid container spacing={3}>
                    {/* Stats Cards - Now display live data */}
                    <Grid item xs={12} sm={4}><StatsCard title="Total Projects" value={stats.totalProjects} icon={<Assignment />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Active Teams" value={stats.totalTeams} icon={<Group />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Tasks Completed This Week" value={stats.tasksCompletedThisWeek} icon={<TrendingUp />} color="success" /></Grid>

                    {/* Charts (still using mock data) */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Team Performance (Tasks Completed)</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="tasks_completed" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                         <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Overall Project Health</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={projectsStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                            {projectsStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </motion.div>
        </Layout>
    );
};

export default ManagerDashboard;