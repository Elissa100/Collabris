import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  People,
  Assignment,
  Group,
  TrendingUp,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
// CORRECTED IMPORT PATH BELOW
import { fetchUsers, selectAllUsers, selectUserLoading } from '../../store/slices/userSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const isLoading = useSelector(selectUserLoading);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const chartData = [
    { name: 'Jan', users: 12, projects: 8 },
    { name: 'Feb', users: 19, projects: 12 },
    { name: 'Mar', users: 25, projects: 15 },
    { name: 'Apr', users: 32, projects: 20 },
    { name: 'May', users: 28, projects: 18 },
    { name: 'Jun', users: 35, projects: 25 },
  ];

  const pieData = [
    { name: 'Admins', value: users.filter(u => u.roles?.some(r => r.name === 'ROLE_ADMIN')).length, color: '#dc2626' },
    { name: 'Managers', value: users.filter(u => u.roles?.some(r => r.name === 'ROLE_MANAGER')).length, color: '#f59e0b' },
    { name: 'Members', value: users.filter(u => u.roles?.some(r => r.name === 'ROLE_MEMBER')).length, color: '#2563eb' },
  ];

  if (isLoading && users.length === 0) {
    return (
      <Layout>
        <LoadingSpinner message="Loading dashboard data..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, monitor system performance, and oversee operations.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ height: 'fit-content' }}
          >
            Add User
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Total Users" value={users.length.toString()} icon={<People />} color="primary" trend={12} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Active Projects" value="24" icon={<Assignment />} color="secondary" trend={8} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Teams" value="8" icon={<Group />} color="success" trend={15} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Growth Rate" value="23%" icon={<TrendingUp />} color="warning" trend={5} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>User & Project Growth</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="users" fill="#2563eb" name="Users" /><Bar dataKey="projects" fill="#7c3aed" name="Projects" /></BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>User Roles Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie><Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </Grid>

          <Grid item xs={12}>
            <Card><CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>User Management</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table><TableHead><TableRow>
                  <TableCell>User</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell>Joined</TableCell><TableCell align="right">Actions</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {users.slice(0, 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">{user.firstName} {user.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.roles?.map((role) => (
                          <Chip key={role.id} label={role.name.replace('ROLE_', '')} size="small"
                            color={role.name === 'ROLE_ADMIN' ? 'error' : role.name === 'ROLE_MANAGER' ? 'warning' : 'primary'}/>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip label={user.enabled ? 'Active' : 'Pending'} color={user.enabled ? 'success' : 'default'} size="small"/>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right"><IconButton size="small"><Edit /></IconButton><IconButton size="small"><Delete /></IconButton></TableCell>
                    </TableRow>
                  ))}
                </TableBody></Table>
              </TableContainer>
            </CardContent></Card>
          </Grid>
        </Grid>
      </motion.div>
    </Layout>
  );
};

export default AdminDashboard;