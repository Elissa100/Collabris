import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';

interface NavigationItemProps {
  text: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  text,
  icon,
  active,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: 2,
          py: 1.5,
          px: 2,
          minHeight: 48,
          backgroundColor: active
            ? alpha(theme.palette.primary.main, 0.15)
            : 'transparent',
          border: active 
            ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
            : '1px solid transparent',
          color: active 
            ? theme.palette.primary.main
            : theme.palette.text.primary,
          '&:hover': {
            backgroundColor: active
              ? alpha(theme.palette.primary.main, 0.2)
              : alpha(theme.palette.action.hover, 0.08),
            transform: 'translateX(4px)',
            transition: 'all 0.2s ease-in-out',
          },
          '&:before': active ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: '60%',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '0 2px 2px 0',
          } : {},
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: 'inherit',
            '& svg': {
              fontSize: '1.25rem',
            },
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            '& .MuiListItemText-primary': {
              fontSize: '0.875rem',
              fontWeight: active ? 600 : 500,
              letterSpacing: '0.025em',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;
