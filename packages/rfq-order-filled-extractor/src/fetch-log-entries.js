const { web3 } = require('@0x-event-extractor/shared');

const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
const EVENT_TOPIC =
  '0x829fa99d94dc4636925b38632e625736a614c154d55006b7ab6bea979c210c32';

const fetchEvents = async (fromBlock, toBlock) => {
  const logs = await web3.getWrapper().getLogsAsync({
    address: EXCHANGE_PROXY_ADDRESS,
    fromBlock,
    toBlock,
    topics: [EVENT_TOPIC],
  });

  return logs;
};

module.exports = fetchEvents;
