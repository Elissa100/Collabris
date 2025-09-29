import React from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Layout = ({ children, maxWidth = 'lg' }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1C1C1C 0%, #2D2D2D 100%)'
            : 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
      }}
    >
      <Navbar />
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Layout;