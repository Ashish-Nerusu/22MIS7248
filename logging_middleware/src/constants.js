const STACKS = {
  BACKEND: 'backend',
  FRONTEND: 'frontend'
};

const LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal'
};

const BACKEND_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'
];

const FRONTEND_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style'
];

const SHARED_PACKAGES = [
  'auth', 'config', 'middleware', 'utils'
];

module.exports = {
  STACKS,
  LEVELS,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  SHARED_PACKAGES
};
