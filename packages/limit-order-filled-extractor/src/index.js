const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'LimitOrderFilled',
  fetchLogEntries,
  getEventData,
  protocolVersion: 4,
};
