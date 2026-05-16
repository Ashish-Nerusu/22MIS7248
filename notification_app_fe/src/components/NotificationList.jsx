import React from 'react';
import { Box, Typography, CircularProgress, Alert, Pagination } from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationList = ({ 
  notifications, 
  loading, 
  error, 
  page, 
  totalPages, 
  onPageChange,
  viewedIds,
  markAsViewed
}) => {
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!notifications || notifications.length === 0) return <Typography color="text.secondary">No notifications found.</Typography>;

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
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, val) => onPageChange(val)} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
};

export default NotificationList;
