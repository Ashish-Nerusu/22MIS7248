import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchNotifications, fetchTopNotifications } from '../api/api';
import TopNotifications from './TopNotifications';
import NotificationList from './NotificationList';
import * as loggingMiddleware from 'logging_middleware';

const Log = loggingMiddleware?.Log || loggingMiddleware?.default?.Log || (() => {});
const STACKS = loggingMiddleware?.STACKS || loggingMiddleware?.default?.STACKS || {};
const LEVELS = loggingMiddleware?.LEVELS || loggingMiddleware?.default?.LEVELS || {};

const Dashboard = () => {
  const [topNotifs, setTopNotifs] = useState([]);
  const [topLoading, setTopLoading] = useState(true);
  const [topError, setTopError] = useState('');

  const [listNotifs, setListNotifs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('All');
  
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('viewedNotifications');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    Log(STACKS.FRONTEND, LEVELS.INFO, 'page', 'Dashboard loaded');
    loadTopNotifications();
  }, []);

  useEffect(() => {
    loadListNotifications();
  }, [page, filterType]);

  const loadTopNotifications = async () => {
    try {
      setTopLoading(true);
      const res = await fetchTopNotifications(3);
      if (res.success) setTopNotifs(res.data);
    } catch (err) {
      setTopError('Failed to load top notifications.');
    } finally {
      setTopLoading(false);
    }
  };

  const loadListNotifications = async () => {
    try {
      setListLoading(true);
      const res = await fetchNotifications(page, 5, filterType);
      if (res.success) {
        setListNotifs(res.data.results);
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
      }
    } catch (err) {
      setListError('Failed to load notifications.');
    } finally {
      setListLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newType = e.target.value;
    Log(STACKS.FRONTEND, LEVELS.INFO, 'component', `Filter changed to ${newType}`);
    setFilterType(newType);
    setPage(1); // Reset to first page
  };

  const markAsViewed = (id) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('viewedNotifications', JSON.stringify(updated));
    }
  };

  return (
    <Grid container spacing={4}>
      {/* Left Column: All Notifications */}
      <Grid item xs={12} md={8}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>All Notifications</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter Type</InputLabel>
              <Select value={filterType} label="Filter Type" onChange={handleFilterChange}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
                <MenuItem value="General">General</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <NotificationList 
            notifications={listNotifs}
            loading={listLoading}
            error={listError}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            viewedIds={viewedIds}
            markAsViewed={markAsViewed}
          />
        </Paper>
      </Grid>

      {/* Right Column: Top Priority */}
      <Grid item xs={12} md={4}>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fdfdfd' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#dc004e' }}>
            🔥 Top Priority
          </Typography>
          <TopNotifications 
            notifications={topNotifs}
            loading={topLoading}
            error={topError}
            viewedIds={viewedIds}
            markAsViewed={markAsViewed}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
