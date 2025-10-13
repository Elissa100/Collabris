// File path: frontend/src/pages/Dashboard/MemberDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Assignment, Group, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { selectUser } from '../../store/slices/authSlice';
import { getMemberDashboardStats } from '../../services/dashboardService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const COLORS = ['#FFBB28', '#00C49F', '#0088FE']; // To Do, In Progress, Done
// Mock data for one chart
const myProjectsData = [ { name: 'Website Redesign', progress: 75 }, { name: 'Mobile App', progress: 40 }, { name: 'API Integration', progress: 90 }, ];

const MemberDashboard = () => {
    const user = useSelector(selectUser);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getMemberDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch member stats:", error);
                setStats({ myProjects: 'Error', myTeams: 'Error', myTasksDue: 'Error', myTasksData: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <Layout>
                <LoadingSpinner message="Loading Your Dashboard..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome back, {user?.firstName}!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Here's your personal summary of what's happening today.
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}><StatsCard title="My Active Projects" value={stats.myProjects} icon={<Assignment />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="My Teams" value={stats.myTeams} icon={<Group />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="My Tasks Due" value={stats.myTasksDue} icon={<TrendingUp />} color="success" /></Grid>

                    <Grid item xs={12} md={7}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>My Project Progress</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={myProjectsData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={120} />
                                        <Tooltip />
                                        <Bar dataKey="progress" fill="#8884d8" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                         <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>My Task Status</Typography>
                                {/* --- FIX: USING LIVE DATA --- */}
                                {stats.myTasksData && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={stats.myTasksData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                {stats.myTasksData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </motion.div>
        </Layout>
    );
};

export default MemberDashboard;