const BlockRange = require('../model/block-range');

const getLastProcessedBlock = async (eventType, protocolVersion) => {
  const query = { eventType, protocolVersion };
  const options = { sort: { toBlock: -1 } };
  const lastRange = await BlockRange.findOne(query, undefined, options);

  if (lastRange === null) {
    return null;
  }

  return lastRange.toBlock;
};

module.exports = getLastProcessedBlock;
