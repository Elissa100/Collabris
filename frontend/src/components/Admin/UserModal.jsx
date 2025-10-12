// File path: frontend/src/components/Admin/UserModal.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Grid, FormControlLabel, Switch, FormGroup, Checkbox
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const UserModal = ({ open, onClose, onSave, user }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isEditing = !!user;

    useEffect(() => {
        if (user) {
            // If editing, populate the form with user data
            reset({
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                enabled: user.enabled,
                roles: {
                    ADMIN: user.roles.includes('ADMIN'),
                    MANAGER: user.roles.includes('MANAGER'),
                    MEMBER: user.roles.includes('MEMBER')
                }
            });
        } else {
            // If creating, reset to default values
            reset({
                username: '', email: '', firstName: '', lastName: '', enabled: true,
                roles: { ADMIN: false, MANAGER: false, MEMBER: true }
            });
        }
    }, [user, open, reset]);

    const onSubmit = (data) => {
        // Convert the roles object back to an array of strings
        const selectedRoles = Object.keys(data.roles).filter(role => data.roles[role]);
        const finalUserData = { ...data, roles: selectedRoles };
        
        // Remove the roles object from the final data
        delete finalUserData.roles;

        onSave(finalUserData, user?.id);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller name="firstName" control={control} render={({ field }) => (
                                <TextField {...field} label="First Name" fullWidth required error={!!errors.firstName} helperText={errors.firstName?.message} />
                            )} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller name="lastName" control={control} render={({ field }) => (
                                <TextField {...field} label="Last Name" fullWidth required error={!!errors.lastName} helperText={errors.lastName?.message} />
                            )} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller name="username" control={control} render={({ field }) => (
                                <TextField {...field} label="Username" fullWidth required error={!!errors.username} helperText={errors.username?.message} />
                            )} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller name="email" control={control} render={({ field }) => (
                                <TextField {...field} label="Email" type="email" fullWidth required error={!!errors.email} helperText={errors.email?.message} />
                            )} />
                        </Grid>
                        <Grid item xs={12}>
                             <Controller name="password" control={control} render={({ field }) => (
                                <TextField {...field} label="Password" type="password" fullWidth
                                    helperText={isEditing ? "Leave blank to keep current password" : "Required"}
                                    required={!isEditing}
                                    error={!!errors.password} />
                            )} />
                        </Grid>
                        <Grid item xs={12}>
                             <Controller name="enabled" control={control} render={({ field }) => (
                                 <FormControlLabel control={<Switch {...field} checked={field.value} />} label="User Enabled" />
                            )} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <Typography variant="subtitle2">Roles</Typography>
                                <FormControlLabel control={<Controller name="roles.MEMBER" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />} label="Member" />
                                <FormControlLabel control={<Controller name="roles.MANAGER" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />} label="Manager" />
                                <FormControlLabel control={<Controller name="roles.ADMIN" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />} label="Admin" />
                            </FormGroup>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{isEditing ? 'Save Changes' : 'Create User'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserModal;