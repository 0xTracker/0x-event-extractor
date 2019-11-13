const { config } = require('@0x-event-extractor/shared');

const extractEvents = require('./extract-events');

module.exports = () => [
  {
    fn: extractEvents,
    minInterval: config.get('minPollingInterval'),
    maxInterval: config.get('maxPollingInterval'),
  },
];
