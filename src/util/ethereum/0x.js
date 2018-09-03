const { ContractWrappers } = require('0x.js');

const { getProvider } = require('./web3');

let contractWrappers;

const configure = ({ networkId }) => {
  contractWrappers = new ContractWrappers(getProvider(), { networkId });
};

const getClient = () => contractWrappers;

module.exports = { configure, getClient };
