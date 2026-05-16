const { Log } = require('./src/logger');
const { setConfig } = require('./src/config');
const { LEVELS, STACKS } = require('./src/constants');

module.exports = {
  Log,
  setConfig,
  LEVELS,
  STACKS
};
