const config = {
  apiBaseUrl: process.env.LOGGING_API_URL || 'https://api.example.com/log',
  authUrl: process.env.LOGGING_AUTH_URL || 'https://api.example.com/auth',
  appSecret: process.env.LOGGING_APP_SECRET || 'default-secret'
};

const setConfig = (newConfig) => {
  Object.assign(config, newConfig);
};

module.exports = {
  config,
  setConfig
};
