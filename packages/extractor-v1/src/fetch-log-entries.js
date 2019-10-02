const zeroEx = require('./0x');

const BLACKLISTED_ORDER_HASHES = [
  '0x1cbf70d8f6dfee99ee740f4e0e90a97e8e1f0c38a14b8604adadbe28469c0ffa',
];

const fetchLogEntries = async (fromBlock, toBlock) => {
  const logEntries = await zeroEx
    .getClient()
    .exchange.getLogsAsync('LogFill', { fromBlock, toBlock }, {});

  return logEntries.filter(
    event => BLACKLISTED_ORDER_HASHES.includes(event.args.orderHash) === false,
  );
};

module.exports = fetchLogEntries;
