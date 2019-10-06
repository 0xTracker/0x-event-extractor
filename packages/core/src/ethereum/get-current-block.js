const { web3 } = require('@0x-event-extractor/shared');

const getCurrentBlock = async () => {
  const blockNumber = await web3.getWrapper().getBlockNumberAsync();

  return blockNumber;
};

module.exports = getCurrentBlock;
