const _ = require('lodash');

const getConfigForEventType = require('./get-config-for-event-type');
const getLastProcessedBlock = require('./get-last-processed-block');

const getNextBlockRange = async ({
  eventType,
  maxBlockNumber,
  protocolVersion,
}) => {
  const config = getConfigForEventType(eventType, protocolVersion);
  const { maxChunkSize, startBlock } = config;
  const lastBlock = await getLastProcessedBlock(eventType, protocolVersion);
  const fromBlock = lastBlock === null ? startBlock : lastBlock + 1;
  const toBlock = _.clamp(fromBlock + maxChunkSize, 1, maxBlockNumber);

  // Notify the consumer that there are no blocks to process
  if (toBlock < fromBlock) {
    return null;
  }

  return { fromBlock, toBlock };
};

module.exports = getNextBlockRange;
