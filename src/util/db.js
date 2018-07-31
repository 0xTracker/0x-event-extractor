const mongoose = require('mongoose');
const signale = require('signale');

const logger = require('./logger');

mongoose.Promise = global.Promise;

module.exports = {
  connect: connectionString => {
    mongoose.connect(connectionString);

    mongoose.connection.on('connected', () => {
      signale.scope('mongodb').success('database connection established');
    });

    mongoose.connection.on('error', err => {
      logger.logError(err);
    });

    mongoose.connection.on('disconnected', () => {
      signale.scope('mongodb').warn('database connection terminated');
    });
  },
  disconnect: () => {
    mongoose.disconnect();
  },
};
