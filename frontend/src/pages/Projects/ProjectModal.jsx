// File path: frontend/src/pages/Projects/ProjectModal.jsx
import React, { useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('Project name is required').max(100, 'Name cannot exceed 100 characters'),
    description: yup.string().max(1000, 'Description cannot exceed 1000 characters'),
});

const ProjectModal = ({ open, onClose, onSave, project }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const isEditing = !!project;

    useEffect(() => {
        if (open) {
            if (project) {
                // If editing, populate the form with existing project data
                reset({
                    name: project.name || '',
                    description: project.description || ''
                });
            } else {
                // If creating a new project, ensure the form is blank
                reset({
                    name: '',
                    description: ''
                });
            }
        }
    }, [project, open, reset]);

    const onSubmit = (data) => {
        onSave(data, project?.id);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Edit Project' : 'Create a New Project'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Fill in the details below to start your new project.
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
                                        label="Project Name"
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
                                        label="Project Description (Optional)"
                                        fullWidth
                                        multiline
                                        rows={4}
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
                    <Button type="submit" variant="contained">
                        {isEditing ? 'Save Changes' : 'Create Project'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProjectModal;