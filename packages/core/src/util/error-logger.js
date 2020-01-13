const _ = require('lodash');
const bugsnag = require('@bugsnag/js');
const signale = require('signale');

const logger = signale.scope('application');

let bugsnagClient;

const logError = (error, metaData) => {
  if (bugsnagClient !== undefined) {
    bugsnagClient.notify(error, { metaData });
  }

  logger.error(error);
};

const configure = ({ appVersion, bugsnagToken }) => {
  if (_.isString(bugsnagToken)) {
    // The bugsnag client automatically attaches itself to uncaughtException
    // and unhandledRejection events.
    bugsnagClient = bugsnag({
      apiKey: bugsnagToken,
      appVersion,
    });
  } else {
    process.on('uncaughtException', logger.error);
    process.on('unhandledRejection', logger.error);
  }
};

module.exports = {
  configure,
  logError,
};
