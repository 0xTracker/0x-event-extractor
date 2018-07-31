const config = require('config');

const BlockRange = require('../model/block-range');

const getLastProcessedBlock = async protocolVersion => {
  const lastRange = await BlockRange.findOne(
    protocolVersion === 1
      ? { protocolVersion: { $in: [protocolVersion, null] } }
      : { protocolVersion },
    {},
    { sort: { toBlock: -1 } },
  );

  if (lastRange === null) {
    return config.get('genesisBlock');
  }

  return lastRange.toBlock;
};

module.exports = getLastProcessedBlock;
