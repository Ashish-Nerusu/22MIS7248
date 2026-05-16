import React from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import NotificationCard from './NotificationCard';

const TopNotifications = ({ notifications, loading, error, viewedIds, markAsViewed }) => {
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!notifications || notifications.length === 0) return <Typography color="text.secondary">No top priority notifications.</Typography>;

  return (
    <Box>
      {notifications.map(notif => (
        <NotificationCard 
          key={notif.id} 
          notification={notif} 
          isViewed={viewedIds.includes(notif.id)}
          onClick={() => markAsViewed(notif.id)}
        />
      ))}
    </Box>
  );
};

export default TopNotifications;
