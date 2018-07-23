const bluebird = require('bluebird');

const web3 = require('./web3');

const getCurrentBlock = async () => {
  const getBlockNumber = bluebird.promisify(
    web3.getClient().eth.getBlockNumber,
  );
  const blockNumber = await getBlockNumber();

  return blockNumber;
};

module.exports = getCurrentBlock;
