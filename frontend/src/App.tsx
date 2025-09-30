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
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectEffectiveTheme);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const theme = createCollabrisTheme(themeMode);

  useEffect(() => {
    // Initialize authentication on app start
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Load user data if authenticated but no user data
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
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={defaultDashboard} replace /> : 
                <Landing />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={defaultDashboard} replace /> : 
                <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
                <Navigate to={defaultDashboard} replace /> : 
                <Register />
            } 
          />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/teams" element={
            <ProtectedRoute>
              <Layout>
                <div style={{ padding: '2rem' }}>
                  <h1>Teams Management</h1>
                  <p>Teams page coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <Layout>
                <div style={{ padding: '2rem' }}>
                  <h1>Project Management</h1>
                  <p>Projects page coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout>
                <div style={{ padding: '2rem' }}>
                  <h1>Real-time Chat</h1>
                  <p>Chat page coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <div style={{ padding: '2rem' }}>
                  <h1>User Profile</h1>
                  <p>Profile page coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <div style={{ padding: '2rem' }}>
                  <h1>Settings</h1>
                  <p>Settings page coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <Layout>
                <div style={{ padding: '2rem' }}>
                  <h1>Admin Dashboard</h1>
                  <p>Admin dashboard coming soon...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route 
            path="*" 
            element={
              <Navigate 
                to={isAuthenticated ? defaultDashboard : '/'} 
                replace 
              />
            } 
          />
        </Routes>
      </Router>
      
      {/* Toast notifications */}
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
