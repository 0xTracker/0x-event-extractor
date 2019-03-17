const { ContractWrappers } = require('@0x/contract-wrappers');

const { getProviderEngine } = require('./web3');

let contractWrappers;

const configure = ({ networkId }) => {
  contractWrappers = new ContractWrappers(getProviderEngine(), { networkId });
};

const getClient = () => contractWrappers;

module.exports = { configure, getClient };
