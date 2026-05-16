const axios = require('axios');
const { config } = require('./config');

let bearerToken = null;

const authenticate = async () => {
  try {
    const response = await axios.post(config.authUrl, {
      secret: config.appSecret
    });
    
    if (response.data && response.data.token) {
      bearerToken = response.data.token;
      return bearerToken;
    }
    throw new Error('No token received');
  } catch (error) {
    return null;
  }
};

const getToken = async () => {
  if (!bearerToken) {
    await authenticate();
  }
  return bearerToken;
};

const clearToken = () => {
  bearerToken = null;
};

module.exports = {
  getToken,
  clearToken
};
