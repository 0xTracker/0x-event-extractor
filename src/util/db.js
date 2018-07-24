const mongoose = require('mongoose');

const logger = require('./logger');

mongoose.Promise = global.Promise;

module.exports = {
  connect: connectionString => {
    mongoose.connect(connectionString);

    mongoose.connection.on('connected', () => {
      console.log('[mongodb] connection established');
    });

    mongoose.connection.on('error', err => {
      logger.logError(err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('[mongodb] disconnected');
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('[mongodb] disconnection through app termination');
        process.exit(0);
      });
    });
  },
  disconnect: () => {
    mongoose.disconnect();
  },
};
