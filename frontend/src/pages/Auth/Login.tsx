import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { login, clearError, selectIsLoading, selectAuthError, selectIsAuthenticated } from '../../store/slices/authSlice';
import { showSuccessNotification } from '../../store/slices/uiSlice';
import { LoginRequest } from '../../types';
import '../../theme/customStyles.css';

const loginSchema = yup.object().shape({
  username: yup.string().required('Username or Email is required'),
  password: yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { control, handleSubmit, formState: { errors }, getValues } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginRequest) => {
    try {
      await dispatch(login(data)).unwrap();
      dispatch(showSuccessNotification('Welcome back!', 'You have successfully logged in.'));
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
        // --- MODIFICATION START: Corrected error handling ---
        if (err && err.message && err.message.includes('verify your email')) {
            const username = getValues("username");
            // The username could be an email, which is what the verification page needs
            navigate('/verify-email', { state: { email: username } });
        }
        // --- MODIFICATION END ---
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[400]} 100%)`,
      }}
    >
      <Card
        sx={{ maxWidth: 400, width: '100%', mx: 2, borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        className="animate-fade-in"
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Collabris account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller name="username" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Username or Email" error={!!errors.username} helperText={errors.username?.message} sx={{ mb: 2 }} /> )}/>
            <Controller name="password" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Password" type={showPassword ? 'text' : 'password'} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2 }} InputProps={{ endAdornment: ( <InputAdornment position="end"> <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />} </IconButton> </InputAdornment> ), }} /> )}/>
            <Box textAlign="right" sx={{ mb: 2 }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot Password?
                </Link>
            </Box>
            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ py: 1.5, mb: 2 }}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>
            </Divider>
            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2">
                Create an account
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;