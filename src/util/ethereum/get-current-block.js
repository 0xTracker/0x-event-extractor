const web3 = require('./web3');

const getCurrentBlock = async () => {
  const blockNumber = await web3.getWrapper().getBlockNumberAsync();

  return blockNumber;
};

module.exports = getCurrentBlock;
