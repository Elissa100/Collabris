// File path: frontend/src/components/Notifications/NotificationBell.tsx
import React, { useState } from 'react';
import { IconButton, Badge, Menu } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useAppSelector } from '../../store/store';
import { selectUnreadNotificationCount } from '../../store/slices/notificationSlice';
import NotificationDropdown from './NotificationDropdown'; // We will create this next

const NotificationBell: React.FC = () => {
    const unreadCount = useAppSelector(selectUnreadNotificationCount);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    style: {
                        maxHeight: 480,
                        width: '40ch',
                    },
                }}
            >
                {/* The content of the dropdown will be its own component */}
                <NotificationDropdown onClose={handleClose} />
            </Menu>
        </>
    );
};

export default NotificationBell;