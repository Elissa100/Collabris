import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout/Layout';
// CORRECTED IMPORT: Changed 'updateUser' to 'setUser'
import { setUser } from '../../store/slices/authSlice';
import { updateUserProfile, selectUserLoading } from '../../store/slices/userSlice';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isLoading = useSelector(selectUserLoading);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      const resultAction = await dispatch(updateUserProfile({ id: user.id, userData: data }));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        // CORRECTED DISPATCH: Changed 'updateUser' to 'setUser'
        dispatch(setUser(resultAction.payload));
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(resultAction.payload || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
            toast.success("Profile picture updated (preview). Upload functionality coming soon!");
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Profile Settings</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Manage your personal information and account settings.</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <Box position="relative" display="inline-block" mb={2}>
                <Avatar src={profileImage || user?.profilePicture} sx={{ width: 120, height: 120, mx: 'auto' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                  <PhotoCamera />
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </IconButton>
              </Box>
              <Typography variant="h6" gutterBottom>{user?.firstName} {user?.lastName}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>@{user?.username}</Typography>
              <Box mt={1}>
                {user?.roles?.map((role) => (
                  <Chip key={role.id} label={role.name.replace('ROLE_', '')} size="small" color={role.name === 'ROLE_ADMIN' ? 'error' : role.name === 'ROLE_MANAGER' ? 'warning' : 'primary'} />
                ))}
              </Box>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card><CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Personal Information</Typography>
                {!isEditing ? (
                  <Button startIcon={<Edit />} onClick={handleEdit}>Edit Profile</Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <Button onClick={handleCancel} color="inherit">Cancel</Button>
                    <Button startIcon={<Save />} onClick={handleSubmit(onSubmit)} variant="contained" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                  </Box>
                )}
              </Box>
              {isEditing ? (
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} /></Grid>
                  </Grid>
                </Box>
              ) : (
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Full Name</Typography><Typography>{user?.firstName} {user?.lastName}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Email Address</Typography><Typography>{user?.email}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Username</Typography><Typography>@{user?.username}</Typography></Grid>
                  <Grid item xs={12} sm={6}><Typography variant="body2" color="text.secondary">Member Since</Typography><Typography>{new Date(user?.createdAt).toLocaleDateString()}</Typography></Grid>
                </Grid>
              )}
            </CardContent></Card>
          </Grid>
        </Grid>
      </motion.div>
    </Layout>
  );
};

export default Profile;