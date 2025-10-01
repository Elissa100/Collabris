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
import { signup, clearError, selectIsLoading, selectAuthError } from '../../store/slices/authSlice';
import { SignupRequest } from '../../types';
import '../../theme/customStyles.css';

const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
});

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  const { control, handleSubmit, formState: { errors } } = useForm<SignupRequest & { confirmPassword: string }>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: SignupRequest & { confirmPassword: string }) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await dispatch(signup(signupData)).unwrap();
      
      // --- MODIFICATION START: Redirect to verification page on success ---
      navigate('/verify-email', { state: { email: data.email } });
      // --- MODIFICATION END ---

    } catch (error) {
      console.error('Registration failed:', error);
      // Error is handled by the slice and displayed in the Alert component
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
        py: 4,
      }}
    >
      <Card
        sx={{ maxWidth: 450, width: '100%', mx: 2, borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        className="animate-fade-in"
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Join Collabris
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account to start collaborating
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box display="flex" gap={2} mb={2}>
              <Controller name="firstName" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="First Name" error={!!errors.firstName} helperText={errors.firstName?.message} /> )}/>
              <Controller name="lastName" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} /> )}/>
            </Box>
            <Controller name="username" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Username" error={!!errors.username} helperText={errors.username?.message} sx={{ mb: 2 }} /> )}/>
            <Controller name="email" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Email Address" type="email" error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2 }} /> )}/>
            <Controller name="password" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Password" type={showPassword ? 'text' : 'password'} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2 }} InputProps={{ endAdornment: ( <InputAdornment position="end"> <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />} </IconButton> </InputAdornment> ), }} /> )}/>
            <Controller name="confirmPassword" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Confirm Password" type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ mb: 3 }} /> )}/>

            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ py: 1.5, mb: 2 }}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
            </Divider>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
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