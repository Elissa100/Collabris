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
import { fetchUsers } from '../../store/slices/userSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);

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
    { name: 'Admins', value: users.filter(u => u.roles?.includes('ROLE_ADMIN')).length, color: '#2C3E50' },
    { name: 'Managers', value: users.filter(u => u.roles?.includes('ROLE_MANAGER')).length, color: '#18BC9C' },
    { name: 'Members', value: users.filter(u => u.roles?.includes('ROLE_MEMBER')).length, color: '#3498DB' },
  ];

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading dashboard..." />
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
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Users"
              value={users.length.toString()}
              icon={<People />}
              color="primary"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Projects"
              value="24"
              icon={<Assignment />}
              color="secondary"
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Teams"
              value="8"
              icon={<Group />}
              color="success"
              trend={15}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Growth Rate"
              value="23%"
              icon={<TrendingUp />}
              color="warning"
              trend={5}
            />
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User & Project Growth
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#2C3E50" name="Users" />
                    <Bar dataKey="projects" fill="#18BC9C" name="Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Roles Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Users Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    User Management
                  </Typography>
                  <Button variant="outlined" startIcon={<Add />}>
                    Add New User
                  </Button>
                </Box>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, 10).map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          component={TableRow}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Box ml={2}>
                                <Typography variant="body2" fontWeight="medium">
                                  {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  @{user.username}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5} flexWrap="wrap">
                              {user.roles?.map((role) => (
                                <Chip
                                  key={role}
                                  label={role.replace('ROLE_', '')}
                                  size="small"
                                  color={
                                    role === 'ROLE_ADMIN' ? 'error' :
                                    role === 'ROLE_MANAGER' ? 'warning' : 'primary'
                                  }
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.enabled ? 'Active' : 'Inactive'}
                              color={user.enabled ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" color="primary">
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Layout>
  );
};

export default AdminDashboard;