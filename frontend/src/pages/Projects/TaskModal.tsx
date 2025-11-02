import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem, Box, Typography, List, ListItem, ListItemText, IconButton, Chip, ListItemIcon } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, User, FileMetadata, TaskPriority } from '../../types'; // <-- IMPORT TaskPriority
import FileUpload from '../../components/Common/FileUpload';
import { Attachment as AttachmentIcon, Close as CloseIcon } from '@mui/icons-material';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any, taskId?: number) => void;
  task?: Task | null;
  projectMembers: User[];
}

// Update schema to include optional dueDate
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  assigneeId: yup.number().nullable(),
  priority: yup.string().oneOf(Object.values(TaskPriority)),
  dueDate: yup.string().nullable(),
});

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, task, projectMembers }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const isEditing = !!task;
  const [attachments, setAttachments] = useState<FileMetadata[]>([]);

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        assigneeId: task?.assignee?.id || null,
        priority: task?.priority || TaskPriority.MEDIUM, // <-- ADDED
        dueDate: task?.dueDate || '', // <-- ADDED
      });
      setAttachments(task?.attachments || []);
    }
  }, [task, open, reset]);

  const onSubmit = (data: any) => {
    // Filter out empty string for dueDate
    const finalData = {
        ...data,
        dueDate: data.dueDate || null,
        attachmentIds: attachments.map(att => att.id),
    };
    onSave(finalData, task?.id);
  };

  const handleUploadComplete = (metadata: FileMetadata) => {
    setAttachments(prev => [...prev, metadata]);
  };

  const handleRemoveAttachment = (idToRemove: number) => {
    setAttachments(prev => prev.filter(att => att.id !== idToRemove));
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
            {/* --- NEW ROW FOR PRIORITY AND DUE DATE --- */}
            <Grid item xs={12} sm={6}>
              <Controller name="priority" control={control} render={({ field }) => (
                <TextField {...field} select label="Priority" fullWidth>
                  {Object.values(TaskPriority).map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Controller name="dueDate" control={control} render={({ field }) => (
                    <TextField
                        {...field}
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
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

            <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments</Typography>
                <FileUpload onUploadComplete={handleUploadComplete} />
                <List dense>
                    {attachments.map(att => (
                        <ListItem key={att.id}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveAttachment(att.id)}>
                                    <CloseIcon />
                                </IconButton>
                            }
                        >
                            <ListItemIcon><AttachmentIcon /></ListItemIcon>
                            <ListItemText primary={att.fileName} secondary={`${(att.size / 1024).toFixed(1)} KB`} />
                        </ListItem>
                    ))}
                </List>
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