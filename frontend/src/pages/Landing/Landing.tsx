import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectEffectiveTheme, toggleTheme } from '../../store/slices/themeSlice';
import '../../theme/customStyles.css';

const Landing: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectEffectiveTheme);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Team Management',
      description: 'Organize teams, assign roles, and manage member permissions with ease.',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      title: 'Project Tracking',
      description: 'Track project progress, set deadlines, and monitor team productivity.',
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Chat',
      description: 'Communicate instantly with team members through integrated messaging.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Analytics Dashboard',
      description: 'Get insights into team performance and project metrics.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with role-based access control.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast performance with modern web technologies.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      avatar: 'SJ',
      rating: 5,
      text: 'Collabris transformed how our team collaborates. The real-time features are game-changing!',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: 'MC',
      rating: 5,
      text: 'The most intuitive project management tool I\'ve used. Setup was incredibly easy.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      avatar: 'ER',
      rating: 5,
      text: 'Finally, a collaboration platform that actually makes our workflow smoother.',
    },
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Collabris
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleThemeToggle} color="inherit">
              {currentTheme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            <Button
              color="inherit"
              onClick={handleSignIn}
              sx={{ textTransform: 'none' }}
            >
              Sign In
            </Button>
            
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="6" cy="6" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="animate-fade-in">
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    color: 'white',
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Collaborate
                  <br />
                  <span className="gradient-text-primary">Seamlessly</span>
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    color: alpha('#ffffff', 0.9),
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Transform your team's productivity with powerful project management,
                  real-time communication, and intelligent analytics.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleGetStarted}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(37, 99, 235, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Free Trial
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleSignIn}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      color: 'white',
                      borderColor: alpha('#ffffff', 0.5),
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: alpha('#ffffff', 0.1),
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                className="animate-slide-right"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  '& > div': {
                    width: '100%',
                    maxWidth: 500,
                    height: 400,
                    background: alpha('#ffffff', 0.1),
                    borderRadius: 3,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#ffffff', 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: alpha('#ffffff', 0.8),
                  },
                }}
              >
                <div>
                  🚀 Interactive Demo Coming Soon
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Everything You Need
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Powerful features designed to streamline collaboration and boost your team's productivity.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                className="hover-lift"
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: theme.palette.background.default, py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Loved by Teams
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See what our users say about Collabris
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  className="hover-lift"
                  sx={{
                    height: '100%',
                    p: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 8,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Ready to Transform Your Team?
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of teams already using Collabris to collaborate more effectively.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleGetStarted}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: '#2563eb',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              '&:hover': {
                backgroundColor: '#f8fafc',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Your Free Trial
          </Button>
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
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Collabris
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              © 2024 Collabris. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
