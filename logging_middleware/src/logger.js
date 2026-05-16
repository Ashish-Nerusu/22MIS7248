const axios = require('axios');
const { validateLog } = require('./validator');
const { getToken, clearToken } = require('./auth');
const { config } = require('./config');

const sendLog = async (payload, retry = true) => {
  const token = await getToken();
  if (!token) return false;

  try {
    await axios.post(config.apiBaseUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401 && retry) {
      clearToken();
      return await sendLog(payload, false);
    }
    return false;
  }
};

const Log = async (stack, level, pkg, message) => {
  try {
    validateLog(stack, level, pkg, message);
    
    const payload = {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString()
    };

    return await sendLog(payload);
  } catch (error) {
    return false;
  }
};

module.exports = {
  Log
};
