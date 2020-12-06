const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'LiquidityProviderSwap',
  fetchLogEntries,
  getEventData,
  protocolVersion: 4,
};
