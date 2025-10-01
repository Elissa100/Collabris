import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  useTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { forgotPassword } from '../../services/authService';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword(data);
      toast.success('If an account exists, a reset code has been sent to your email.');
      navigate('/reset-password', { state: { email: data.email } });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            Enter your email and we'll send you a code to reset your password.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;