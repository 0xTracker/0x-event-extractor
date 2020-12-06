const { web3 } = require('@0x-event-extractor/shared');

const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
const LIQUIDITY_PROVIDER_SWAP_EVENT_TOPIC =
  '0x40a6ba9513d09e3488135e0e0d10e2d4382b792720155b144cbea89ac9db6d34';

const fetchEvents = async (fromBlock, toBlock) => {
  const logs = await web3.getWrapper().getLogsAsync({
    address: EXCHANGE_PROXY_ADDRESS,
    fromBlock,
    toBlock,
    topics: [LIQUIDITY_PROVIDER_SWAP_EVENT_TOPIC],
  });

  return logs;
};

module.exports = fetchEvents;
