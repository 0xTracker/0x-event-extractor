const { config } = require('@0x-event-extractor/shared');

const extractEvents = require('./extract-events');

module.exports = [
  {
    fn: extractEvents,
    interval: config.get('pollingInterval'),
    maxRetries: 10,
  },
];
