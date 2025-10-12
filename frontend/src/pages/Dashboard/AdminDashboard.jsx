// File Path: frontend/src/pages/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { PeopleAlt, FolderSpecial, Dns, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { getAdminDashboardStats } from '../../services/dashboardService';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import UserTable from '../../components/Admin/UserTable';
import UserModal from '../../components/Admin/UserModal';

const COLORS = ['#FF8042', '#FFBB28', '#0088FE']; // For Admins, Managers, Members

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchAllData = async () => {
        try {
            // No need to set loading here, it's already true
            const [statsData, usersData] = await Promise.all([
                getAdminDashboardStats(),
                getAllUsers(),
            ]);
            setStats(statsData);
            setUsers(usersData);
        } catch (error) {
            toast.error("Failed to load dashboard data. Please refresh.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData, userId) => {
        try {
            if (userId) {
                await updateUser(userId, userData);
                toast.success("User updated successfully!");
            } else {
                await createUser(userData);
                toast.success("User created successfully!");
            }
            handleCloseModal();
            fetchAllData(); 
        } catch (error) {
            toast.error(error.message || "Failed to save user.");
            console.error(error);
        }
    };
    
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(userId);
                toast.success("User deleted successfully!");
                fetchAllData(); 
            } catch (error) {
                toast.error(error.message || "Failed to delete user.");
                console.error(error);
            }
        }
    };
    
    // --- THIS IS THE KEY FIX ---
    // Show a loading spinner if we are in the initial loading state OR if stats is still null.
    // This prevents any rendering attempt before the data is ready.
    if (loading || !stats) {
        return <Layout><LoadingSpinner message="Loading Admin Dashboard..." /></Layout>;
    }

    return (
        <Layout>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>System Administration</Typography>
                        <Typography variant="body1" color="text.secondary">Manage users, monitor platform health, and view system-wide analytics.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Create New User</Button>
                </Box>

                <Grid container spacing={3}>
                    {/* These will now render safely */}
                    <Grid item xs={12} sm={4}><StatsCard title="Total Users" value={stats.totalUsers} icon={<PeopleAlt />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Projects" value={stats.totalProjects} icon={<FolderSpecial />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Teams" value={stats.totalTeams} icon={<Dns />} color="success" /></Grid>

                    <Grid item xs={12} md={7}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>User Growth (Last 6 Months)</Typography>
                                {/* Safety check for userGrowth array */}
                                {stats.userGrowth && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={stats.userGrowth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                         <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>User Role Distribution</Typography>
                                {/* Safety check for roleDistribution array */}
                                {stats.roleDistribution && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={stats.roleDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                                {stats.roleDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>User Management</Typography>
                                {/* Safety check for the users array */}
                                {users && (
                                    <UserTable users={users} onEdit={handleOpenModal} onDelete={handleDeleteUser} />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <UserModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    user={editingUser}
                />
            </motion.div>
        </Layout>
    );
};

export default AdminDashboard;