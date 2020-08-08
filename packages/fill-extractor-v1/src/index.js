const fetchLogEntries = require('./fetch-log-entries');
const getEventData = require('./get-event-data');
const zeroEx = require('./0x');

const configure = options => {
  zeroEx.configure(options);
};

module.exports = {
  configure,
  eventType: 'LogFill',
  fetchLogEntries,
  getEventData,
  protocolVersion: 1,
};
