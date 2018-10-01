const { ContractWrappers } = require('0x.js');

const { getProviderEngine } = require('./web3');

let contractWrappers;

const configure = ({ networkId }) => {
  contractWrappers = new ContractWrappers(getProviderEngine(), { networkId });
};

const getClient = () => contractWrappers;

module.exports = { configure, getClient };
