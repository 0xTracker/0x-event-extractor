const _ = require('lodash');
const { config } = require('@0x-event-extractor/shared');

const getConfigForEventType = (eventType, protocolVersion) => {
  const camelEventType = _.camelCase(eventType);
  const startBlockKey = `startBlock.${camelEventType}.v${protocolVersion}`;
  const startBlock = config.get(startBlockKey);
  const maxChunkSize = config.get('maxChunkSize');
  const minConfirmations = config.get('minConfirmations');

  if (startBlock === undefined) {
    throw new Error(
      `Start block config not found for v${protocolVersion} ${eventType} events`,
    );
  }

  return { startBlock, maxChunkSize, minConfirmations };
};

module.exports = getConfigForEventType;
