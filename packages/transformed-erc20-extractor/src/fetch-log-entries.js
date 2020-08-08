const { web3 } = require('@0x-event-extractor/shared');

const EXCHANGE_PROXY_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
const TRANSFORMED_ERC20_EVENT_TOPIC =
  '0x0f6672f78a59ba8e5e5b5d38df3ebc67f3c792e2c9259b8d97d7f00dd78ba1b3';

const fetchEvents = async (fromBlock, toBlock) => {
  const logs = await web3.getWrapper().getLogsAsync({
    address: EXCHANGE_PROXY_ADDRESS,
    fromBlock,
    toBlock,
    topics: [TRANSFORMED_ERC20_EVENT_TOPIC],
  });

  return logs;
};

module.exports = fetchEvents;
