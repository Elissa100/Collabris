// File path: frontend/src/pages/Dashboard/ActivityFeedWidget.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Paper, Avatar, ListItemAvatar } from '@mui/material';
import { getActivityFeed } from '../../services/activityService';
import { ActivityLog } from '../../types';
import toast from 'react-hot-toast';

const ActivityFeedWidget: React.FC = () => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const feed = await getActivityFeed();
                setActivities(feed);
            } catch (err: any) {
                setError('Could not load the activity feed.');
                toast.error('Failed to fetch recent activities.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Recent Activity
            </Typography>
            {activities.length === 0 ? (
                <Typography color="text.secondary">No recent activity to show.</Typography>
            ) : (
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {activities.map((log) => (
                        <ListItem key={log.id} divider>
                            <ListItemAvatar>
                                <Avatar>{log.actor?.firstName?.charAt(0) || 'S'}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2">
                                        <strong>{log.actor?.username || 'System'}</strong> {log.details}
                                    </Typography>
                                }
                                secondary={new Date(log.timestamp).toLocaleString()}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default ActivityFeedWidget;