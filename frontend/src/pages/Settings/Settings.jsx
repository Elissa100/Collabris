import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  Divider,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from '@mui/material';
import {
  DarkMode,
  Notifications,
  Security,
  Storage,
  Delete,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout/Layout';
import { toggleTheme, selectEffectiveTheme } from '../../store/slices/themeSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const effectiveTheme = useSelector(selectEffectiveTheme);
  const { user } = useSelector((state) => state.auth);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const settingsCategories = [
    {
      title: 'Appearance',
      icon: <DarkMode />,
      settings: [
        {
          label: 'Dark Mode',
          description: 'Toggle between light and dark theme',
          control: (
            <Switch
              checked={effectiveTheme === 'dark'}
              onChange={handleThemeToggle}
              color="primary"
            />
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      settings: [
        {
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          control: <Switch defaultChecked color="primary" />,
        },
        {
          label: 'Push Notifications',
          description: 'Receive push notifications in browser',
          control: <Switch defaultChecked color="primary" />,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: <Security />,
      settings: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          control: <Button variant="outlined" size="small">Enable</Button>,
        },
      ],
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Customize your experience and manage your preferences.
        </Typography>

        <Grid container spacing={3}>
          {settingsCategories.map((category, index) => (
            <Grid item xs={12} key={category.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {category.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {category.title}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                      {category.settings.map((setting, settingIndex) => (
                        <ListItem key={settingIndex} divider={settingIndex < category.settings.length - 1}>
                          <ListItemText
                            primary={setting.label}
                            secondary={setting.description}
                          />
                          <ListItemSecondaryAction>
                            {setting.control}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}

          {/* Danger Zone */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Delete color="error" />
                    <Typography variant="h6" sx={{ ml: 1 }} color="error">
                      Danger Zone
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    This action is irreversible. Please proceed with caution.
                  </Alert>
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          Delete Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Permanently delete your account and all data.
                        </Typography>
                      </Box>
                      <Button variant="outlined" color="error">
                        Delete My Account
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Layout>
  );
};

export default Settings;