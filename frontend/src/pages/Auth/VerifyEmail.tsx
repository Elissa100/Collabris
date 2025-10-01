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
import { useAppDispatch } from '../../store/store';
import { verifyEmail, resendVerificationEmail } from '../../services/authService';
import { showSuccessNotification, showErrorNotification } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError('Verification code must be 6 characters long.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await verifyEmail({ code });
      dispatch(showSuccessNotification('Success!', 'Your email has been verified. Please log in.'));
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!email) {
        toast.error("Could not find an email to resend the code to. Please try registering again.");
        return;
    }
    setResendLoading(true);
    try {
        await resendVerificationEmail({ email });
        toast.success("A new verification code has been sent to your email.");
    } catch (err: any) {
        toast.error(err.message || "Failed to resend verification code.");
    } finally {
        setResendLoading(false);
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
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
            A 6-character verification code has been sent to your email address.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5rem' } }}
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Button>
            <Button fullWidth onClick={handleResendCode} disabled={resendLoading} sx={{ mt: 1 }}>
                {resendLoading ? 'Sending...' : 'Resend Code'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyEmail;