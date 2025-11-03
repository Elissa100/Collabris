import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem, Box, Typography,
    List, ListItem, ListItemText, IconButton, Chip, Autocomplete, ListItemIcon
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, User, FileMetadata, TaskPriority } from '../../types';
import FileUpload from '../../components/Common/FileUpload';
import { Attachment as AttachmentIcon, Close as CloseIcon, Lock as LockIcon } from '@mui/icons-material';
import { addDependency, removeDependency } from '../../services/dependencyService';
import toast from 'react-hot-toast';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any, taskId?: number) => void;
  task?: Task | null;
  projectMembers: User[];
  allProjectTasks: Task[];
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  assigneeId: yup.number().nullable(),
  priority: yup.string().oneOf(Object.values(TaskPriority)),
  dueDate: yup.string().nullable(),
});

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, task, projectMembers = [], allProjectTasks = [] }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
        title: '',
        description: '',
        assigneeId: null,
        priority: TaskPriority.MEDIUM,
        dueDate: ''
    }
  });
  const isEditing = !!task;
  const [attachments, setAttachments] = useState<FileMetadata[]>([]);
  
  const potentialDependencies = allProjectTasks.filter(
      (t) => t.id !== task?.id && !(task?.dependencies || []).some(d => d.id === t.id)
  );

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        assigneeId: task?.assignee?.id || null,
        priority: task?.priority || TaskPriority.MEDIUM,
        dueDate: task?.dueDate || '',
      });
      setAttachments(task?.attachments || []);
    }
  }, [task, open, reset]);

  const onSubmit = (data: any) => {
    const finalData = {
        ...data,
        dueDate: data.dueDate || null,
        assigneeId: data.assigneeId || null, // Ensure empty string becomes null
        attachmentIds: attachments.map(att => att.id),
    };
    onSave(finalData, task?.id);
  };

  const handleUploadComplete = (metadata: FileMetadata) => setAttachments(prev => [...prev, metadata]);
  const handleRemoveAttachment = (idToRemove: number) => setAttachments(prev => prev.filter(att => att.id !== idToRemove));
  const handleAddDependency = async (dependency: Task | null) => {
      if (!task || !dependency) return;
      try {
          await addDependency(task.id, dependency.id);
          toast.success(`Task now depends on '${dependency.title}'`);
          onClose();
      } catch (error: any) {
          toast.error(error.message || "Failed to add dependency.");
      }
  };
  const handleRemoveDependency = async (dependencyId: number) => {
      if (!task) return;
      try {
          await removeDependency(task.id, dependencyId);
          toast.success("Dependency removed.");
          onClose();
      } catch (error: any) {
          toast.error("Failed to remove dependency.");
      }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><Controller name="title" control={control} render={({ field }) => ( <TextField {...field} label="Task Title" fullWidth autoFocus required error={!!errors.title} helperText={errors.title?.message} /> )}/></Grid>
            <Grid item xs={12}><Controller name="description" control={control} render={({ field }) => ( <TextField {...field} label="Description" fullWidth multiline rows={4} /> )}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="priority" control={control} render={({ field }) => ( <TextField {...field} select label="Priority" fullWidth> {Object.values(TaskPriority).map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))} </TextField> )}/></Grid>
            <Grid item xs={12} sm={6}><Controller name="dueDate" control={control} render={({ field }) => ( <TextField {...field} label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} /> )}/></Grid>
            
            {/* --- THE DEFINITIVE FIX FOR THE ASSIGNEE DROPDOWN --- */}
            <Grid item xs={12}>
                <Controller
                    name="assigneeId"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value || ''} // <-- THIS IS THE FIX. Coerce null to an empty string for MUI.
                            select
                            label="Assign To"
                            fullWidth
                        >
                            <MenuItem value=""><em>Unassigned</em></MenuItem>
                            {projectMembers.map(member => (
                                <MenuItem key={member.id} value={member.id}>
                                    {member.firstName} {member.lastName} (@{member.username})
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </Grid>

            <Grid item xs={12}><Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments</Typography><FileUpload onUploadComplete={handleUploadComplete} /><List dense> {attachments.map(att => ( <ListItem key={att.id} secondaryAction={ <IconButton edge="end" onClick={() => handleRemoveAttachment(att.id)}> <CloseIcon /> </IconButton> } > <ListItemIcon><AttachmentIcon /></ListItemIcon> <ListItemText primary={att.fileName} secondary={`${(att.size / 1024).toFixed(1)} KB`} /> </ListItem> ))} </List></Grid>
            {isEditing && (
                <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Dependencies (This task is blocked by...)</Typography>
                    <List dense>
                        {(task.dependencies || []).map(dep => (
                            <ListItem key={dep.id} secondaryAction={<IconButton edge="end" onClick={() => handleRemoveDependency(dep.id)}><CloseIcon /></IconButton>}>
                                <ListItemIcon><LockIcon fontSize="small" color={dep.status !== 'DONE' ? 'warning' : 'success'} /></ListItemIcon>
                                <ListItemText primary={dep.title} />
                            </ListItem>
                        ))}
                    </List>
                    <Autocomplete
                        options={potentialDependencies}
                        getOptionLabel={(option) => option.title}
                        onChange={(e, value) => handleAddDependency(value)}
                        renderInput={(params) => <TextField {...params} label="Add dependency..." />}
                    />
                </Grid>
            )}
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