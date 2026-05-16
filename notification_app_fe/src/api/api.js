import axios from 'axios';
import * as loggingMiddleware from 'logging_middleware';

const Log = loggingMiddleware?.Log || loggingMiddleware?.default?.Log || (() => {});
const STACKS = loggingMiddleware?.STACKS || loggingMiddleware?.default?.STACKS || {};
const LEVELS = loggingMiddleware?.LEVELS || loggingMiddleware?.default?.LEVELS || {};

const API_BASE_URL = 'http://localhost:3000/api/notifications';

export const fetchNotifications = async (page = 1, limit = 10, type = '') => {
  try {
    const params = { page, limit };
    if (type && type !== 'All') params.type = type;

    const response = await axios.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    Log(STACKS.FRONTEND, LEVELS.ERROR, 'api', `Failed to fetch paginated notifications: ${error.message}`);
    throw error;
  }
};

export const fetchTopNotifications = async (limit = 3) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/top`, { params: { limit } });
    return response.data;
  } catch (error) {
    Log(STACKS.FRONTEND, LEVELS.ERROR, 'api', `Failed to fetch top notifications: ${error.message}`);
    throw error;
  }
};
