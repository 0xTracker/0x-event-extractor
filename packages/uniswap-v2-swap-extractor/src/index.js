const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'UniswapV2Swap',
  fetchLogEntries,
  getEventData,
  protocolVersion: 3,
};
