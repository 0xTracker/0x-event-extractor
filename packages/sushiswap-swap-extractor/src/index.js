const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'SushiswapSwap',
  fetchLogEntries,
  getEventData,
  protocolVersion: 3,
};
