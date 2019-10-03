const { clamp } = require('lodash');
const { config } = require('@0x-event-extractor/shared');

const getLastProcessedBlock = require('./get-last-processed-block');

const getNextBlockRange = async ({ currentBlock, protocolVersion }) => {
  const genesisBlock = config.get(`v${protocolVersion}.genesisBlock`);
  const maxChunkSize = config.get('maxChunkSize');
  const minConfirmations = config.get('minConfirmations');
  const lastProcessedBlock = await getLastProcessedBlock(protocolVersion);
  const maxBlock = currentBlock - minConfirmations;
  const fromBlock =
    lastProcessedBlock !== null ? lastProcessedBlock + 1 : genesisBlock;
  const toBlock = clamp(fromBlock + maxChunkSize, 1, maxBlock);

  // Notify the consumer that there are no blocks to process
  if (toBlock < fromBlock) {
    return null;
  }

  return { fromBlock, toBlock };
};

module.exports = getNextBlockRange;
