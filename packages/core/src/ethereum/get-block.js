const { web3 } = require('@0x-event-extractor/shared');

const getBlock = async blockNumber => {
  const block = await web3.getWrapper().getBlockIfExistsAsync(blockNumber);

  return block;
};

module.exports = getBlock;
