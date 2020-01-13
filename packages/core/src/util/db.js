const mongoose = require('mongoose');
const signale = require('signale');

const { logError } = require('./error-logger');

const logger = signale.scope('mongodb');

mongoose.Promise = global.Promise;

module.exports = {
  connect: async connectionString => {
    mongoose.connection.on('connecting', () => {
      logger.info('connecting to database');
    });

    mongoose.connection.on('connected', () => {
      logger.success('database connection established');
    });

    mongoose.connection.on('error', err => {
      logError(err);
    });

    mongoose.connection.on('disconnecting', () => {
      logger.warn('disconnecting from database');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('database connection terminated');
    });

    mongoose.connection.on('reconnected', () => {
      logger.warn('reconnected to database');
    });

    mongoose.connection.on('reconnectFailed', () => {
      logError('Database reconnection failed');
    });

    await mongoose.connect(connectionString, {
      autoIndex: false,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  disconnect: () => {
    mongoose.disconnect();
  },
};
