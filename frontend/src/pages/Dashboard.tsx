import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  Chat as ChatIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/store';
import { selectUser } from '../store/slices/authSlice';
import api from '../services/api';

interface DashboardStats {
  totalProjects: number;
  activeTeams: number;
  completedTasks: number;
  pendingTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'team' | 'task' | 'message';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  avatar?: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
  teamId: number;
  teamName?: string;
  memberCount: number;
  dueDate?: string;
  createdAt: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
  isOwner: boolean;
  isAdmin: boolean;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTeams: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentTeams, setRecentTeams] = useState<Team[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's projects
        const projectsResponse = await api.get('/projects/user');
        const projects = projectsResponse.data;
        
        // Fetch user's teams
        const teamsResponse = await api.get('/teams/user');
        const teams = teamsResponse.data;
        
        // Calculate stats
        const activeProjects = projects.filter((p: Project) => p.status === 'ACTIVE');
        const completedProjects = projects.filter((p: Project) => p.status === 'COMPLETED');
        
        setStats({
          totalProjects: projects.length,
          activeTeams: teams.length,
          completedTasks: completedProjects.length * 5, // Estimate
          pendingTasks: activeProjects.length * 3, // Estimate
        });
        
        // Set recent data (limit to 6 items each)
        setRecentProjects(projects.slice(0, 6));
        setRecentTeams(teams.slice(0, 6));
        
        // Generate mock recent activity
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'project',
            title: 'Project Updated',
            description: `${projects[0]?.name || 'New Project'} progress updated to 75%`,
            timestamp: '2 hours ago',
            user: user?.username || 'User',
            avatar: user?.username?.charAt(0) || 'U',
          },
          {
            id: '2',
            type: 'team',
            title: 'New Team Member',
            description: `Someone joined ${teams[0]?.name || 'your team'}`,
            timestamp: '4 hours ago',
          },
          {
            id: '3',
            type: 'task',
            title: 'Task Completed',
            description: 'Database optimization task completed',
            timestamp: '1 day ago',
            user: user?.username || 'User',
          },
          {
            id: '4',
            type: 'message',
            title: 'New Message',
            description: 'New message in project chat',
            timestamp: '2 days ago',
          },
        ];
        setRecentActivity(mockActivity);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default mock data on error
        setStats({
          totalProjects: 5,
          activeTeams: 3,
          completedTasks: 12,
          pendingTasks: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return theme.palette.success.main;
      case 'COMPLETED':
        return theme.palette.info.main;
      case 'ON_HOLD':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <ProjectIcon sx={{ color: theme.palette.primary.main }} />;
      case 'team':
        return <PeopleIcon sx={{ color: theme.palette.success.main }} />;
      case 'task':
        return <CheckIcon sx={{ color: theme.palette.info.main }} />;
      case 'message':
        return <ChatIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const StatCard = ({ title, value, icon, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          backdropFilter: 'blur(20px)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                mr: 2,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                {loading ? <Skeleton width={60} /> : value}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {title}
              </Typography>
            </Box>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 0.5, fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                +{trend}% this month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: theme.palette.mode === 'light' 
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.firstName || user?.username || 'User'}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Here's what's happening with your projects and teams today.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/projects/new')}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                },
              }}
            >
              New Project
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/teams')}
            >
              View Teams
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<ProjectIcon />}
            trend={15}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Teams"
            value={stats.activeTeams}
            icon={<PeopleIcon />}
            trend={8}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={<CheckIcon />}
            trend={25}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={<WarningIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Projects
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/projects')}
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>
                
                {loading ? (
                  <Box>
                    {[1, 2, 3].map((item) => (
                      <Box key={item} sx={{ mb: 2 }}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="80%" height={20} />
                        <Skeleton variant="rectangular" width="100%" height={4} sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Box>
                ) : recentProjects.length > 0 ? (
                  <Box>
                    {recentProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            mb: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.action.hover, 0.05),
                              cursor: 'pointer',
                            },
                          }}
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {project.name}
                            </Typography>
                            <Chip
                              label={project.status}
                              size="small"
                              sx={{
                                backgroundColor: alpha(getStatusColor(project.status), 0.1),
                                color: getStatusColor(project.status),
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary, mb: 2 }}
                          >
                            {project.description}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                Progress
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {project.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: alpha(theme.palette.grey[500], 0.2),
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 3,
                                  backgroundColor: getStatusColor(project.status),
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                              {project.memberCount} members
                            </Typography>
                            {project.dueDate && (
                              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                Due {new Date(project.dueDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ProjectIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                      No projects yet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/projects/new')}
                    >
                      Create Your First Project
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Sidebar Content */}
        <Grid item xs={12} lg={4}>
          {/* Recent Teams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Your Teams
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/teams')}
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <Box>
                    {[1, 2, 3].map((item) => (
                      <Box key={item} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="70%" />
                          <Skeleton variant="text" width="50%" />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : recentTeams.length > 0 ? (
                  <List>
                    {recentTeams.slice(0, 4).map((team, index) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.action.hover, 0.05),
                              cursor: 'pointer',
                            },
                          }}
                          onClick={() => navigate(`/teams/${team.id}`)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            >
                              {team.name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={team.name}
                            secondary={`${team.memberCount} members • ${team.projectCount} projects`}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" size="small">
                              <MoreIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <PeopleIcon sx={{ fontSize: 40, color: theme.palette.text.disabled, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      No teams yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Activity
                </Typography>

                <List>
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                {activity.timestamp}
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
