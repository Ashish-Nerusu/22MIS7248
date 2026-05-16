import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Campus Notifications
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Dashboard />
      </Container>
    </Box>
  );
}

export default App;
