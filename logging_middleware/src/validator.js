const {
  STACKS,
  LEVELS,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  SHARED_PACKAGES
} = require('./constants');

const isValidStack = (stack) => {
  return Object.values(STACKS).includes(stack);
};

const isValidLevel = (level) => {
  return Object.values(LEVELS).includes(level);
};

const isValidPackage = (stack, pkg) => {
  if (SHARED_PACKAGES.includes(pkg)) return true;
  
  if (stack === STACKS.BACKEND && BACKEND_PACKAGES.includes(pkg)) return true;
  if (stack === STACKS.FRONTEND && FRONTEND_PACKAGES.includes(pkg)) return true;

  return false;
};

const validateLog = (stack, level, pkg, message) => {
  if (!isValidStack(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }
  if (!isValidLevel(level)) {
    throw new Error(`Invalid level: ${level}`);
  }
  if (!isValidPackage(stack, pkg)) {
    throw new Error(`Invalid package: ${pkg} for stack: ${stack}`);
  }
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string');
  }
};

module.exports = {
  validateLog
};
