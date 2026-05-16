import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getIcon = (type) => {
  switch (type) {
    case 'Placement': return <NotificationsActiveIcon color="primary" />;
    case 'Result': return <CheckCircleIcon color="success" />;
    case 'Event': return <EventIcon color="secondary" />;
    default: return <SchoolIcon color="action" />;
  }
};

const getColor = (type) => {
  switch (type) {
    case 'Placement': return 'primary';
    case 'Result': return 'success';
    case 'Event': return 'secondary';
    default: return 'default';
  }
};

const NotificationCard = ({ notification, isViewed, onClick }) => {
  const { type, message, timestamp } = notification;
  const date = new Date(timestamp).toLocaleString();

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        opacity: isViewed ? 0.6 : 1,
        borderLeft: isViewed ? '4px solid transparent' : '4px solid #1976d2',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          opacity: 1
        }
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: '16px !important' }}>
        <Box sx={{ mt: 0.5 }}>
          {getIcon(type)}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip label={type} size="small" color={getColor(type)} variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {date}
            </Typography>
          </Box>
          <Typography variant="body1" color={isViewed ? 'text.secondary' : 'text.primary'} sx={{ fontWeight: isViewed ? 'normal' : '500' }}>
            {message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
