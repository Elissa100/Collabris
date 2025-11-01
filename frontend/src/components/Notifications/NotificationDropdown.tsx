// File path: frontend/src/components/Notifications/NotificationDropdown.tsx
import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Divider, Button, ListItemIcon } from '@mui/material';
import { Task as TaskIcon, People as PeopleIcon, Chat as MentionIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
    fetchNotifications,
    markNotificationAsRead,
    selectAllNotifications,
    selectNotificationStatus,
} from '../../store/slices/notificationSlice';
import { NotificationType } from '../../types';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.TASK_ASSIGNED:
            return <TaskIcon color="primary" />;
        case NotificationType.USER_MENTION:
            return <MentionIcon color="secondary" />;
        case NotificationType.PROJECT_UPDATE:
            return <PeopleIcon color="success" />;
        default:
            return <TaskIcon />;
    }
};

interface NotificationDropdownProps {
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notifications = useAppSelector(selectAllNotifications);
    const status = useAppSelector(selectNotificationStatus);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNotifications());
        }
    }, [status, dispatch]);

    const handleNotificationClick = (notification: typeof notifications[0]) => {
        if (!notification.isRead) {
            dispatch(markNotificationAsRead(notification.id));
        }
        
        // Navigate to the relevant page based on the notification
        if (notification.entityType === 'task' && notification.entityId) {
            // This assumes a future route like /tasks/{id}. For now, we log it.
            console.log(`Navigate to task ${notification.entityId}`);
            // navigate(`/tasks/${notification.entityId}`);
        }

        onClose(); // Close the dropdown after clicking
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
        }
        if (notifications.length === 0) {
            return <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No notifications yet.</Typography>;
        }
        return (
            <List disablePadding>
                {notifications.map((notification) => (
                    <ListItem
                        key={notification.id}
                        button
                        onClick={() => handleNotificationClick(notification)}
                        sx={{ bgcolor: notification.isRead ? 'transparent' : 'action.hover' }}
                    >
                        <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                        <ListItemText
                            primary={notification.message}
                            secondary={new Date(notification.createdAt).toLocaleString()}
                            primaryTypographyProps={{
                                fontWeight: notification.isRead ? 'normal' : 'bold'
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        );
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">Notifications</Typography>
                <Button size="small">Mark all as read</Button>
            </Box>
            <Divider />
            {renderContent()}
        </Box>
    );
};

export default NotificationDropdown;