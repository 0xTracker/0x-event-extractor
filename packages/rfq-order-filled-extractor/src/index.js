const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');

module.exports = {
  configure: () => {},
  eventType: 'RfqOrderFilled',
  fetchLogEntries,
  getEventData,
  protocolVersion: 4,
};
