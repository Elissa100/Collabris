import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { selectIsAuthenticated, selectIsLoading, selectUser, getCurrentUser } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login' 
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  if (isLoading || (isAuthenticated && !user)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Add check for enabled user
  if (user && !user.enabled) {
    return <Navigate to="/verify-email" state={{ from: location, email: user.email }} replace />;
  }
  
  if (requiredRoles.length > 0 && user) {
    const userRoles = user.roles.map(role => role.name);
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role as any));
    
    if (!hasRequiredRole) {
      const redirectPath = userRoles.includes('ADMIN') ? '/admin/dashboard' : '/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;