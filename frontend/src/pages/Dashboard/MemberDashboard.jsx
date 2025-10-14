import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Assignment, Group, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { selectUser } from '../../store/slices/authSlice';
import { getMemberDashboardStats } from '../../services/dashboardService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import MyTasksWidget from './MyTasksWidget'; // 1. IMPORT THE NEW WIDGET

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
                setStats({ myProjects: 'N/A', myTeams: 'N/A', myTasksDue: 'N/A' });
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
                    {/* Stats cards remain the same */}
                    <Grid item xs={12} sm={4}><StatsCard title="My Active Projects" value={stats.myProjects} icon={<Assignment />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="My Teams" value={stats.myTeams} icon={<Group />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="My Tasks Due" value={stats.myTasksDue} icon={<TrendingUp />} color="success" /></Grid>

                    {/* 2. ADD THE NEW WIDGET HERE */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <MyTasksWidget />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </motion.div>
        </Layout>
    );
};

export default MemberDashboard;