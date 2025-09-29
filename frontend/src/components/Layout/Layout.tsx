import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectUser, selectIsAdmin, logout } from '../../store/slices/authSlice';
import { selectEffectiveTheme, toggleTheme } from '../../store/slices/themeSlice';
import { toggleSidebar, selectSidebarOpen, selectMobileSidebarOpen, toggleMobileSidebar } from '../../store/slices/uiSlice';
import NavigationItem from './NavigationItem';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const currentTheme = useAppSelector(selectEffectiveTheme);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const mobileSidebarOpen = useAppSelector(selectMobileSidebarOpen);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleDrawerToggle = () => {
    if (isMobile) {
      dispatch(toggleMobileSidebar());
    } else {
      dispatch(toggleSidebar());
    }
  };
  
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  
  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      text: 'Teams',
      icon: <PeopleIcon />,
      path: '/teams',
      active: location.pathname.startsWith('/teams'),
    },
    {
      text: 'Projects', 
      icon: <ProjectIcon />,
      path: '/projects',
      active: location.pathname.startsWith('/projects'),
    },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/chat',
      active: location.pathname.startsWith('/chat'),
    },
    ...(isAdmin ? [{
      text: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/admin/dashboard',
      active: location.pathname.startsWith('/admin'),
    }] : []),
  ];
  
  const userMenuItems = [
    {
      text: 'Profile',
      icon: <PersonIcon />,
      onClick: () => navigate('/profile'),
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      onClick: () => navigate('/settings'),
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      onClick: handleLogout,
    },
  ];
  
  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
          : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography
          variant="h5"
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
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
          }}
        >
          Collaboration Platform
        </Typography>
      </Box>
      
      {/* Navigation */}
      <List sx={{ px: 2, py: 2 }}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.text}
            {...item}
            onClick={() => navigate(item.path)}
          />
        ))}
      </List>
      
      <Divider sx={{ mx: 2, opacity: 0.1 }} />
      
      {/* User Info */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                fontSize: '0.875rem',
              }}
            >
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'User'
                }
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {user?.roles?.[0]?.name?.replace('ROLE_', '') || 'Member'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {navigationItems.find(item => item.active)?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {currentTheme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  fontSize: '0.875rem',
                }}
              >
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => {
              handleMenuClose();
              item.onClick();
            }}
            sx={{ py: 1.5, px: 2 }}
          >
            <Box sx={{ mr: 2, color: 'action.active' }}>
              {item.icon}
            </Box>
            {item.text}
          </MenuItem>
        ))}
      </Menu>
      
      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: sidebarOpen ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={isMobile ? mobileSidebarOpen : sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          minHeight: '100vh',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
