import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowForward,
  People,
  Assignment,
  Chat,
  Security,
  Speed,
  CloudSync,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../store/slices/themeSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { darkMode } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.roles?.includes('ROLE_ADMIN') ? '/admin' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Team Management',
      description: 'Create and manage teams with role-based access control. Organize your workforce efficiently.',
      color: '#2C3E50'
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Project Tracking',
      description: 'Track projects from inception to completion with detailed analytics and progress monitoring.',
      color: '#18BC9C'
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: 'Real-time Chat',
      description: 'Communicate instantly with team members through integrated chat rooms and messaging.',
      color: '#E74C3C'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with JWT authentication and role-based permissions.',
      color: '#9B59B6'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'High Performance',
      description: 'Lightning-fast performance with real-time updates and optimized data handling.',
      color: '#F39C12'
    },
    {
      icon: <CloudSync sx={{ fontSize: 40 }} />,
      title: 'Cloud Integration',
      description: 'Seamless cloud integration with automatic backups and cross-device synchronization.',
      color: '#3498DB'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '500+', label: 'Projects Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1C1C1C 0%, #2D2D2D 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #18BC9C, #2C3E50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Collabris
          </Typography>
          
          <IconButton onClick={() => dispatch(toggleDarkMode())} color="inherit">
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="outlined" 
                color="inherit"
                sx={{ borderColor: 'currentColor' }}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <Button 
              onClick={handleGetStarted}
              variant="contained"
              color="primary"
            >
              Go to Dashboard
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(45deg, #FFFFFF, #F8F9FA)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Collaborate Smarter,
              <br />
              Achieve More
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: alpha('#FFFFFF', 0.9),
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              The ultimate collaboration platform for modern teams. Manage projects, 
              communicate in real-time, and drive success together.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleGetStarted}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #18BC9C, #16A085)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #16A085, #138D75)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
              
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/login"
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    borderColor: alpha('#FFFFFF', 0.3),
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: alpha('#FFFFFF', 0.1),
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Box>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: '#FFFFFF',
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: alpha('#FFFFFF', 0.8),
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: theme.palette.background.default,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Powerful Features
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 600,
                  mx: 'auto',
                }}
              >
                Everything you need to manage teams, projects, and communication in one place
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${alpha(feature.color, 0.05)} 100%)`,
                        border: `1px solid ${alpha(feature.color, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 8px 25px ${alpha(feature.color, 0.15)}`,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box
                          sx={{
                            color: feature.color,
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)'
            : 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          color: '#FFFFFF',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                Ready to Transform Your Team?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                Join thousands of teams already using Collabris to achieve their goals faster and more efficiently.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleGetStarted}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #18BC9C, #16A085)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #16A085, #138D75)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Your Journey'}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #18BC9C, #2C3E50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Collabris
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              © 2025 Collabris. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;