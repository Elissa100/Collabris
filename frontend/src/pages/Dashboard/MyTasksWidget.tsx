import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Task } from '../../types';
import { getMyAssignedTasks } from '../../services/taskService';
import toast from 'react-hot-toast';

const getStatusChip = (status: Task['status']) => {
    switch (status) {
        case 'TO_DO':
            return <Chip label="To Do" color="warning" size="small" />;
        case 'IN_PROGRESS':
            return <Chip label="In Progress" color="primary" size="small" />;
        case 'DONE':
            return <Chip label="Done" color="success" size="small" />;
        default:
            return <Chip label={status} size="small" />;
    }
};

const MyTasksWidget: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const assignedTasks = await getMyAssignedTasks();
                setTasks(assignedTasks);
            } catch (err: any) {
                setError('Could not load your assigned tasks.');
                toast.error('Failed to fetch tasks.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                My Assigned Tasks
            </Typography>
            {tasks.length === 0 ? (
                <Typography color="text.secondary">You have no tasks assigned to you. Great job!</Typography>
            ) : (
                <List disablePadding>
                    {tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            divider
                            button
                            component={RouterLink}
                            to={`/projects/${task.projectId}`}
                            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                        >
                            <ListItemText
                                primary={task.title}
                                secondary={`In Project ID: ${task.projectId} - Due: ${task.dueDate || 'No date'}`}
                            />
                            {getStatusChip(task.status)}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default MyTasksWidget;