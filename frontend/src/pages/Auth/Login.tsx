// File path: frontend/src/pages/Auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Card, CardContent, TextField, Button, Typography, Link, Alert,
    InputAdornment, IconButton, Divider, useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    EmailOutlined as EmailIcon,
    LockOutlined as PasswordIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { login, clearError, selectIsLoading, selectAuthError } from '../../store/slices/authSlice';
import { LoginRequest } from '../../types'; // Import the type

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

    const { control, handleSubmit, formState: { errors }, getValues } = useForm<LoginRequest>({
        resolver: yupResolver(loginSchema),
        defaultValues: { username: '', password: '' },
    });

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // --- THIS IS THE FIX ---
    // Added the 'LoginRequest' type to the 'data' parameter
    const onSubmit = async (data: LoginRequest) => {
        try {
            await dispatch(login(data)).unwrap();
            const from = (location.state as any)?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (err: any) {
            if (err && err.message && err.message.includes('verify your email')) {
                const usernameOrEmail = getValues("username");
                navigate('/verify-email', { state: { email: usernameOrEmail } });
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                p: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 420,
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    backdropFilter: 'blur(20px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue to Collabris
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Controller name="username" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Username or Email" error={!!errors.username} helperText={errors.username?.message} sx={{ mb: 2 }} InputProps={{ startAdornment: ( <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> ), }} /> )}/>
                        <Controller name="password" control={control} render={({ field }) => ( <TextField {...field} fullWidth label="Password" type={showPassword ? 'text' : 'password'} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 3 }} InputProps={{ startAdornment: ( <InputAdornment position="start"><PasswordIcon color="action" /></InputAdornment> ), endAdornment: ( <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> ), }} /> )}/>

                        <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ py: 1.5, mb: 2, fontWeight: 600 }}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        
                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary"> OR </Typography>
                        </Divider>

                        <Box textAlign="center">
                            <Typography variant="body2" color="text.secondary"> Don't have an account?{' '} <Link component={RouterLink} to="/register" fontWeight="medium"> Sign up </Link> </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;