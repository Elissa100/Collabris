import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { createCollabrisTheme } from './theme/theme';
import { useAppSelector, useAppDispatch } from './store/store';
import { selectEffectiveTheme } from './store/slices/themeSlice';
import { selectIsAuthenticated, selectUser, getCurrentUser } from './store/slices/authSlice';
import './theme/customStyles.css';

// Import components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectEffectiveTheme);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const theme = createCollabrisTheme(themeMode);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  const isAdmin = user?.roles?.some(role => role.name === 'ADMIN') || false;
  const defaultDashboard = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to={defaultDashboard} replace />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={defaultDashboard} replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={defaultDashboard} replace />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><UserDashboard /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRoles={['ADMIN']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? defaultDashboard : '/'} replace />} />
        </Routes>
      </Router>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      />
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;