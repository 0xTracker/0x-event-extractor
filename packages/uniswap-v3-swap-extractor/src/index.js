const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'UniswapV3Swap',
  fetchLogEntries,
  getEventData,
  protocolVersion: 3,
};
