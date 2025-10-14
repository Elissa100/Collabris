import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, User } from '../../types';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any, taskId?: number) => void;
  task?: Task | null;
  projectMembers: User[];
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  assigneeId: yup.number().nullable(),
});

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, task, projectMembers }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const isEditing = !!task;

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        assigneeId: task?.assignee?.id || null,
      });
    }
  }, [task, open, reset]);

  const onSubmit = (data: any) => {
    onSave(data, task?.id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller name="title" control={control} render={({ field }) => (
                <TextField {...field} label="Task Title" fullWidth autoFocus required error={!!errors.title} helperText={errors.title?.message} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="description" control={control} render={({ field }) => (
                <TextField {...field} label="Description" fullWidth multiline rows={4} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="assigneeId" control={control} render={({ field }) => (
                <TextField {...field} select label="Assign To" fullWidth>
                  <MenuItem value=""><em>Unassigned</em></MenuItem>
                  {projectMembers.map(member => (
                    <MenuItem key={member.id} value={member.id}>{member.firstName} {member.lastName} (@{member.username})</MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{isEditing ? 'Save Changes' : 'Create Task'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;