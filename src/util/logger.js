const _ = require('lodash');
const Rollbar = require('rollbar');
const signale = require('signale');

let rollbar;

const logger = signale.scope('application');

const configure = ({ rollbarToken }) => {
  if (_.isString(rollbarToken)) {
    rollbar = new Rollbar({
      accessToken: rollbarToken,
      captureUncaught: true,
      captureUnhandledRejections: true,
    });
  }

  process.on('uncaughtException', logger.error);
  process.on('unhandledRejection', logger.error);
};

const logError = (error, metadata = {}) => {
  if (rollbar) {
    rollbar.error(error, metadata.request);
  }

  logger.error(error);
};

module.exports = {
  configure,
  logError,
};
