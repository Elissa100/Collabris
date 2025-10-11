import React from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Group,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { selectUser } from '../../store/slices/authSlice';

// Mock Data for Charts - This will later come from the backend/Redux store
const myTasksData = [
  { name: 'To Do', value: 8 },
  { name: 'In Progress', value: 4 },
  { name: 'Done', value: 12 },
];
const COLORS = ['#FFBB28', '#00C49F', '#0088FE'];

const myProjectsData = [
    { name: 'Website Redesign', progress: 75 },
    { name: 'Mobile App', progress: 40 },
    { name: 'API Integration', progress: 90 },
];

const MemberDashboard = () => {
    const user = useSelector(selectUser);

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
                    {/* Stats Cards */}
                    <Grid item xs={12} sm={4}><StatsCard title="My Active Projects" value="3" icon={<Assignment />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="My Teams" value="2" icon={<Group />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="My Tasks Due" value="8" icon={<TrendingUp />} color="success" /></Grid>

                    {/* Charts */}
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
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={myTasksData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {myTasksData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
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

export default MemberDashboard;