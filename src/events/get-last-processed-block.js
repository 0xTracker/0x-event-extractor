const _ = require('lodash');

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
    return _.toNumber(process.env.GENESIS_BLOCK);
  }

  return lastRange.toBlock;
};

module.exports = getLastProcessedBlock;
