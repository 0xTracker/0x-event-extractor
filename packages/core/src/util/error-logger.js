const _ = require('lodash');
const bugsnag = require('@bugsnag/js');

let bugsnagClient;

const logError = (error, metaData) => {
  if (bugsnagClient !== undefined) {
    bugsnagClient.notify(error, { metaData });
  }

  console.error(error); // eslint-disable-line no-console
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
    process.on('uncaughtException', console.error); // eslint-disable-line no-console
    process.on('unhandledRejection', console.error); // eslint-disable-line no-console
  }
};

module.exports = {
  configure,
  logError,
};
