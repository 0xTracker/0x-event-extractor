const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'TransformedERC20',
  fetchLogEntries,
  getEventData,
  protocolVersion: 3,
};
