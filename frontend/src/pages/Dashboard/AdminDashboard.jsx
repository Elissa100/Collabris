// File path: frontend/src/pages/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { PeopleAlt, FolderSpecial, Dns, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import { getAdminDashboardStats } from '../../services/dashboardService';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/userService'; // Import user services
import LoadingSpinner from '../../components/Common/LoadingSpinner';

import UserTable from '../../components/Admin/UserTable'; // Import the new components
import UserModal from '../../components/Admin/UserModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [statsData, usersData] = await Promise.all([
                getAdminDashboardStats(),
                getAllUsers(),
            ]);
            setStats(statsData);
            setUsers(usersData);
        } catch (error) {
            toast.error("Failed to load dashboard data.");
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
                // Update existing user
                await updateUser(userId, userData);
                toast.success("User updated successfully!");
            } else {
                // Create new user
                await createUser(userData);
                toast.success("User created successfully!");
            }
            handleCloseModal();
            fetchAllData(); // Refresh all data
        } catch (error) {
            toast.error(error.message || "Failed to save user.");
            console.error(error);
        }
    };
    
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                toast.success("User deleted successfully!");
                fetchAllData(); // Refresh all data
            } catch (error) {
                toast.error(error.message || "Failed to delete user.");
                console.error(error);
            }
        }
    };

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
                    {/* This button now opens the modal */}
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Create New User</Button>
                </Box>

                <Grid container spacing={3}>
                    {/* Stats Cards remain the same */}
                    <Grid item xs={12} sm={4}><StatsCard title="Total Users" value={stats.totalUsers} icon={<PeopleAlt />} color="primary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Projects" value={stats.totalProjects} icon={<FolderSpecial />} color="secondary" /></Grid>
                    <Grid item xs={12} sm={4}><StatsCard title="Total Teams" value={stats.totalTeams} icon={<Dns />} color="success" /></Grid>

                    {/* NEW User Management Table */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>User Management</Typography>
                                <UserTable users={users} onEdit={handleOpenModal} onDelete={handleDeleteUser} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* The Modal for creating/editing users */}
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