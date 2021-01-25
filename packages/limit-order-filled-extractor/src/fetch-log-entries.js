const { web3 } = require('@0x-event-extractor/shared');

const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
const EVENT_TOPIC =
  '0xab614d2b738543c0ea21f56347cf696a3a0c42a7cbec3212a5ca22a4dcff2124';

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
