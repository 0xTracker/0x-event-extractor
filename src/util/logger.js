const _ = require('lodash');
const bugsnag = require('bugsnag');
const signale = require('signale');

let useBugsnag = false;

const logger = signale.scope('application');

const configure = ({ bugsnagToken }) => {
  if (_.isString(bugsnagToken)) {
    bugsnag.register(bugsnagToken);
    useBugsnag = true;
  }

  process.on('uncaughtException', logger.error);
  process.on('unhandledRejection', logger.error);
};

const logError = error => {
  if (useBugsnag) {
    bugsnag.notify(error);
  }

  logger.error(error);
};

module.exports = {
  configure,
  logError,
};
