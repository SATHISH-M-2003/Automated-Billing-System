import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ComingSoon = ({ title: propTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to determine page title from path if not provided
  let title = propTitle;
  if (!title) {
    const path = location.pathname.substring(1);
    title = path.charAt(0).toUpperCase() + path.slice(1);
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <Paper
          className="glass-panel hover-grow"
          sx={{
            p: 5,
            width: '100%',
            borderRadius: 6,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              opacity: 0.15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          />
          {/* Mock Gear / Construction icon under overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '15%',
              color: 'primary.main',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              transform: 'translateY(12px)'
            }}
          >
            🚧
          </Box>

          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800 }}>
            {title || 'Page'}
          </Typography>
          
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
            Coming Soon!
          </Typography>

          <Typography variant="body1" color="text.secondary">
            This module is currently under development. The Automated Billing Dashboard is the active center of operations. Check back soon for updates.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mt: 2, px: 3, py: 1.2, borderRadius: 3 }}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ComingSoon;
