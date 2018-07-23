const extractEvents = require('./extract-events');

const pollingIntervals = {
  events: process.env.POLLING_INTERVAL_EVENTS || 30000,
};

module.exports = [
  { fn: extractEvents, interval: pollingIntervals.events, maxRetries: 10 },
];
