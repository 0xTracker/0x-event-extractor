const _ = require('lodash');
const Rollbar = require('rollbar');

let rollbar;

const configure = ({ rollbarToken }) => {
  if (_.isString(rollbarToken)) {
    rollbar = new Rollbar({
      accessToken: rollbarToken,
      captureUncaught: true,
      captureUnhandledRejections: true,
    });
  }

  process.on('uncaughtException', console.error);
  process.on('unhandledRejection', console.error);
};

const logError = (error, metadata = {}) => {
  if (rollbar) {
    rollbar.error(error, metadata.request);
  }

  console.error(error);
};

module.exports = {
  configure,
  logError,
};
