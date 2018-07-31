const config = require('config');

const extractEvents = require('./extract-events');

module.exports = [
  {
    fn: extractEvents,
    interval: config.get('pollingInterval'),
    maxRetries: 10,
  },
];
