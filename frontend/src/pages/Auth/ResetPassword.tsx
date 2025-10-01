import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { resetPassword } from '../../services/authService';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  code: yup.string().length(6, 'Code must be 6 characters').required('Verification code is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Please confirm your password'),
});

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' }
  });

  const onSubmit = async (data: any) => {
    if (!email) {
      setError("Email not found. Please start the process again.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword({ email, code: data.code, newPassword: data.newPassword });
      toast.success('Password has been reset successfully. Please log in.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
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
            Reset Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            Enter the code sent to your email and your new password.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {!email && <Alert severity="warning" sx={{ mb: 2 }}>No email provided. Please start from the 'Forgot Password' page.</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller name="code" control={control} render={({ field }) => (
                <TextField {...field} fullWidth label="Reset Code" error={!!errors.code} helperText={errors.code?.message} sx={{ mb: 2 }} />
            )}/>
            <Controller name="newPassword" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="password" label="New Password" error={!!errors.newPassword} helperText={errors.newPassword?.message} sx={{ mb: 2 }} />
            )}/>
            <Controller name="confirmPassword" control={control} render={({ field }) => (
                <TextField {...field} fullWidth type="password" label="Confirm New Password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ mb: 2 }} />
            )}/>
            
            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading || !email}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;