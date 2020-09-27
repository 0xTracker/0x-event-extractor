const _ = require('lodash');
const { config } = require('@0x-event-extractor/shared');

const getConfigForEventType = (eventType, protocolVersion) => {
  const camelEventType = _.camelCase(eventType);
  const defaultChunkSize = config.get(`maxChunkSize.default`);

  const startBlockKey = `startBlock.${camelEventType}.v${protocolVersion}`;
  const startBlock = config.get(startBlockKey);

  const chunkSizeKey = `maxChunkSize.${camelEventType}.v${protocolVersion}`;
  const maxChunkSize = config.get(chunkSizeKey) || defaultChunkSize;

  if (startBlock === undefined) {
    throw new Error(
      `Start block config not found for v${protocolVersion} ${eventType} events`,
    );
  }

  return { startBlock, maxChunkSize };
};

module.exports = getConfigForEventType;
