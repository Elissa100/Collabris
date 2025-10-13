// File path: frontend/src/pages/Teams/TeamModal.jsx
import React, { useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('Team name is required').max(100, 'Name cannot exceed 100 characters'),
    description: yup.string().max(1000, 'Description cannot exceed 1000 characters'),
});

const TeamModal = ({ open, onClose, onSave, team }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const isEditing = !!team;

    useEffect(() => {
        if (open) {
            if (team) {
                reset({
                    name: team.name || '',
                    description: team.description || ''
                });
            } else {
                reset({ name: '', description: '' });
            }
        }
    }, [team, open, reset]);

    const onSubmit = (data) => {
        onSave(data, team?.id);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Edit Team' : 'Create a New Team'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Bring people together to collaborate on projects.
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Team Name"
                                        fullWidth
                                        required
                                        autoFocus
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description (Optional)"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="secondary">
                        {isEditing ? 'Save Changes' : 'Create Team'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TeamModal;