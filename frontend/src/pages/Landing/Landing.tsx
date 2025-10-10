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
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectEffectiveTheme, toggleTheme } from '../../store/slices/themeSlice';
import '../../theme/customStyles.css';

const Landing: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectEffectiveTheme);

  const handleGetStarted = () => navigate('/register');
  const handleSignIn = () => navigate('/login');
  const handleThemeToggle = () => dispatch(toggleTheme());

  const features = [
    { icon: <PeopleIcon sx={{ fontSize: 40 }} />, title: 'Team Management', description: 'Organize teams, assign roles, and manage permissions with ease.' },
    { icon: <AssignmentIcon sx={{ fontSize: 40 }} />, title: 'Project Tracking', description: 'Track project progress, set deadlines, and monitor team productivity.' },
    { icon: <ChatIcon sx={{ fontSize: 40 }} />, title: 'Real-time Chat', description: 'Communicate instantly with team members through integrated messaging.' },
    { icon: <SecurityIcon sx={{ fontSize: 40 }} />, title: 'Secure & Private', description: 'Enterprise-grade security with role-based access control.' },
    { icon: <SpeedIcon sx={{ fontSize: 40 }} />, title: 'Fast & Responsive', description: 'Lightning-fast performance with modern web technologies.' },
  ];

  const testimonials = [
    { name: 'Sarah J.', role: 'Product Manager', avatar: 'SJ', rating: 5, text: 'Collabris transformed how our team collaborates. The real-time features are game-changing!' },
    { name: 'Michael C.', role: 'Software Engineer', avatar: 'MC', rating: 5, text: 'The most intuitive project management tool I\'ve used. Setup was incredibly easy.' },
    { name: 'Emily R.', role: 'Design Lead', avatar: 'ER', rating: 5, text: 'Finally, a platform that actually makes our workflow smoother.' },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Collabris</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* --- THIS IS THE CORRECTED LINE --- */}
            <IconButton onClick={handleThemeToggle} color="inherit">
              {currentTheme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button color="inherit" onClick={handleSignIn} sx={{ textTransform: 'none', display: { xs: 'none', sm: 'inline-flex' } }}>Sign In</Button>
            <Button variant="contained" onClick={handleGetStarted} sx={{ textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' } }}>Get Started</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 800, mb: 2, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Collaborate Smarter, Achieve More</Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: '700px', mx: 'auto' }}>The ultimate platform for modern teams. Manage projects, communicate in real-time, and drive success together.</Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={handleGetStarted} sx={{ px: 5, py: 1.5, fontSize: '1.1rem', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' } }}>Get Started for Free</Button>
        </Container>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                  <Card sx={{ height: '100%', p: 2, textAlign: 'center', border: 'none', background: 'transparent' }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h2" sx={{ fontWeight: 700, mb: 6, textAlign: 'center' }}>Loved by Teams Worldwide</Typography>
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>{[...Array(5)].map((_, i) => <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />)}</Box>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', flexGrow: 1, mb: 2 }}>"{testimonial.text}"</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <Avatar sx={{ width: 48, height: 48, mr: 2, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>{testimonial.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{testimonial.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ textAlign: 'center', py: 12 }}>
          <Typography variant="h2" component="h2" sx={{ fontWeight: 700, mb: 2 }}>Ready to Transform Your Team?</Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>Join thousands of teams collaborating more effectively with Collabris.</Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={handleGetStarted} sx={{ px: 5, py: 1.5, fontSize: '1.1rem', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', '&:hover': { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' } }}>Start Your Free Trial</Button>
        </Container>
      </motion.div>

      <Box component="footer" sx={{ py: 4, backgroundColor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Collabris</Typography>
            <Typography variant="body2" color="text.secondary">© {new Date().getFullYear()} Collabris. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// A helper hook for consistent theme usage
const useAppTheme = () => useTheme();

export default Landing;