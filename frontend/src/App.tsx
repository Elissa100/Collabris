// File path: frontend/src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { store, useAppDispatch, useAppSelector } from './store/store';
import { useTheme } from './hooks/useTheme';

import { getCurrentUser, selectInitialLoad, selectIsAuthenticated } from './store/slices/authSlice';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDetailPage from './pages/Projects/ProjectDetailPage';
import TeamsPage from './pages/Teams/TeamsPage';
import TeamDetailPage from './pages/Teams/TeamDetailPage';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';

const InitialLoadingScreen = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <LoadingSpinner message="Initializing Application..." />
    </Box>
);

const AppContent = () => {
    const dispatch = useAppDispatch();
    const initialLoad = useAppSelector(selectInitialLoad);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [theme] = useTheme();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);
    
    if (initialLoad === 'idle' || initialLoad === 'loading') {
        return <InitialLoadingScreen />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toaster position="bottom-right" reverseOrder={false} />
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    
                    <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
                    <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />

                    <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
                    {/* --- 2. ADD THE NEW DYNAMIC ROUTE FOR TEAM DETAILS --- */}
                    <Route path="/teams/:teamId" element={<ProtectedRoute><TeamDetailPage /></ProtectedRoute>} />
                    
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

const App = () => (
    <Provider store={store}>
        <AppContent />
    </Provider>
);

export default App;