const _ = require('lodash');

const BlockRange = require('../model/block-range');

const getLastProcessedBlock = async () => {
  const lastRange = await BlockRange.findOne({}, {}, { sort: { toBlock: -1 } });

  if (lastRange === null) {
    return _.toNumber(process.env.GENESIS_BLOCK);
  }

  return lastRange.toBlock;
};

module.exports = getLastProcessedBlock;
