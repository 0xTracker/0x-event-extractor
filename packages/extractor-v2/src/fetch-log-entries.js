const zeroEx = require('./0x');

const fetchEvents = async (fromBlock, toBlock) => {
  const events = await zeroEx
    .getClient()
    .exchange.getLogsAsync('Fill', { fromBlock, toBlock }, {});

  return events;
};

module.exports = fetchEvents;
