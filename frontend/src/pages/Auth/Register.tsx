import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { signup, clearError, selectIsLoading, selectAuthError, selectIsAuthenticated } from '../../store/slices/authSlice';
import { showSuccessNotification } from '../../store/slices/uiSlice';
import { SignupRequest } from '../../types';
import '../../theme/customStyles.css';

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { control, handleSubmit, formState: { errors } } = useForm<SignupRequest & { confirmPassword: string }>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: SignupRequest & { confirmPassword: string }) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await dispatch(signup(signupData)).unwrap();
      dispatch(showSuccessNotification(
        'Registration Successful!', 
        'Your account has been created. You can now sign in.'
      ));
      navigate('/login');
    } catch (error) {
      // Error is handled by the slice
      console.error('Registration failed:', error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
        backgroundAttachment: 'fixed',
        position: 'relative',
        py: 4,
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
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          mx: 2,
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
        }}
        className="animate-fade-in"
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <PersonAddIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
              }}
            >
              Join Collabris
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account and start collaborating
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name Fields */}
            <Box display="flex" gap={2} mb={2}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    autoComplete="given-name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    autoComplete="family-name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Box>

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Username"
                  type="text"
                  autoComplete="username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleConfirmPasswordVisibility}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in to your account
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
