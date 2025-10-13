import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Grid, FormControlLabel, Switch, FormGroup, Checkbox, Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const UserModal = ({ open, onClose, onSave, user }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isEditing = !!user;

    useEffect(() => {
        if (open) {
            if (user) {
                reset({
                    username: user.username || '', email: user.email || '',
                    firstName: user.firstName || '', lastName: user.lastName || '',
                    enabled: user.enabled || false,

                    formRoles: user.roles || [],
                });
            } else {
                reset({
                    username: '', email: '', firstName: '', lastName: '', password: '',
                    enabled: true,
                    // Default new users to just the MEMBER role
                    formRoles: ['MEMBER'],
                });
            }
        }
    }, [user, open, reset]);

    const onSubmit = (data) => {
        //  directly use the 'formRoles' from the form data now, which is an array.
        // ensure the property name is 'roles' for the API call.
        const finalUserData = { 
            ...data, 
            roles: data.formRoles 
        };
        delete finalUserData.formRoles; // Clean up the temporary form field

        onSave(finalUserData, user?.id);
    };

    const handleRoleChange = (role, checked) => {
        const currentRoles = control._formValues.formRoles || [];
        if (checked) {
            // Add the role if it's not already there
            reset({ ...control._formValues, formRoles: [...new Set([...currentRoles, role])] });
        } else {
            // Remove the role
            reset({ ...control._formValues, formRoles: currentRoles.filter(r => r !== role) });
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller name="firstName" control={control} render={({ field }) => ( <TextField {...field} label="First Name" fullWidth required /> )}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller name="lastName" control={control} render={({ field }) => ( <TextField {...field} label="Last Name" fullWidth required /> )}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller name="username" control={control} render={({ field }) => ( <TextField {...field} label="Username" fullWidth required /> )}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller name="email" control={control} render={({ field }) => ( <TextField {...field} label="Email" type="email" fullWidth required /> )}/>
                        </Grid>
                        <Grid item xs={12}>
                             <Controller name="password" control={control} render={({ field }) => (
                                <TextField {...field} label="Password" type="password" fullWidth
                                    helperText={isEditing ? "Leave blank to keep current password" : "Required for new user"}
                                    required={!isEditing} />
                            )} />
                        </Grid>
                        <Grid item xs={12}>
                             <Controller name="enabled" control={control} defaultValue={true} render={({ field }) => ( <FormControlLabel control={<Switch {...field} checked={field.value} />} label="User Enabled" /> )}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2">Roles</Typography>
                            <Controller name="formRoles" control={control} defaultValue={[]} render={({ field }) => (
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={field.value.includes('MEMBER')} onChange={(e) => handleRoleChange('MEMBER', e.target.checked)} />} label="Member" />
                                    <FormControlLabel control={<Checkbox checked={field.value.includes('MANAGER')} onChange={(e) => handleRoleChange('MANAGER', e.target.checked)} />} label="Manager" />
                                    <FormControlLabel control={<Checkbox checked={field.value.includes('ADMIN')} onChange={(e) => handleRoleChange('ADMIN', e.target.checked)} />} label="Admin" />
                                </FormGroup>
                            )} />
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