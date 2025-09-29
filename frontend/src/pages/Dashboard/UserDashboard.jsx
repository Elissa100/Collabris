import React, { useEffect } from 'react';
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
  Person,
  Email,
  CalendarToday,
  Notifications,
  Assignment,
  Group,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import StatsCard from '../../components/Common/StatsCard';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const recentActivities = [
    { id: 1, text: 'Joined project "Website Redesign"', time: '2 hours ago', icon: <Assignment /> },
    { id: 2, text: 'Updated profile information', time: '1 day ago', icon: <Person /> },
    { id: 3, text: 'Joined team "Frontend Developers"', time: '3 days ago', icon: <Group /> },
    { id: 4, text: 'Completed task "Login Component"', time: '1 week ago', icon: <TrendingUp /> },
  ];

  const notifications = [
    { id: 1, text: 'New message from John Doe', time: '5 minutes ago' },
    { id: 2, text: 'Project deadline approaching', time: '1 hour ago' },
    { id: 3, text: 'Team meeting scheduled for tomorrow', time: '2 hours ago' },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName || user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Here's what's happening with your projects today.
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Projects"
              value="3"
              icon={<Assignment />}
              color="primary"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Team Members"
              value="12"
              icon={<Group />}
              color="secondary"
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Tasks Completed"
              value="24"
              icon={<TrendingUp />}
              color="success"
              trend={15}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Notifications"
              value="5"
              icon={<Notifications />}
              color="warning"
              trend={-3}
            />
          </Grid>

          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={user?.profilePicture}
                    sx={{ width: 64, height: 64, mr: 2 }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user?.username}
                    </Typography>
                    <Box mt={1}>
                      {user?.roles?.map((role) => (
                        <Chip
                          key={role}
                          label={role.replace('ROLE_', '')}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={1}>
                  <Email sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{user?.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Joined {new Date(user?.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List dense>
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {activity.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.text}
                          secondary={activity.time}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Notifications
                </Typography>
                <List dense>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Notifications color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.text}
                          secondary={notification.time}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Layout>
  );
};

export default UserDashboard;