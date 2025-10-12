// File Path: frontend/src/pages/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { PeopleAlt, FolderSpecial, Dns, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { getAdminDashboardStats } from '../../services/dashboardService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const COLORS = ['#FF8042', '#FFBB28', '#0088FE']; // For Admins, Managers, Members

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getAdminDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
                setStats({ 
                    totalUsers: 'Error', totalProjects: 'Error', totalTeams: 'Error',
                    roleDistribution: [], userGrowth: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) { // Added !stats check
        return (
            <Layout>
                <LoadingSpinner message="Loading Admin Dashboard..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>System Administration</Typography>
                        <Typography variant="body1" color="text.secondary">Manage users, monitor platform health, and view system-wide analytics.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />}>Create New User</Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Users" value={stats.totalUsers} icon={<PeopleAlt />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Projects" value={stats.totalProjects} icon={<FolderSpecial />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Teams" value={stats.totalTeams} icon={<Dns />} color="success" /></Grid>

                    {/* --- FIX: USE LIVE DATA FOR CHARTS --- */}
                    <Grid item xs={12} md={7}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>User Growth (Last 6 Months)</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.userGrowth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                         <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>User Role Distribution</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={stats.roleDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                            {stats.roleDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
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

export default AdminDashboard;