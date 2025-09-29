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
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing/Landing';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectEffectiveTheme);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const theme = createCollabrisTheme(themeMode);

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
              <div style={{ padding: '2rem' }}>
                <h1>User Dashboard</h1>
                <p>Dashboard coming soon...</p>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <div style={{ padding: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <p>Admin dashboard coming soon...</p>
              </div>
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
