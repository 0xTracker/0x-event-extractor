const { ContractWrappers } = require('@0x/contract-wrappers');

const { getProviderEngine } = require('./web3');

let contractWrappers;

const configure = ({ networkId }) => {
  contractWrappers = new ContractWrappers(getProviderEngine(), {
    contractAddresses: {
      exchange: '0x080bf510fcbf18b91105470639e9561022937712',
    },
    networkId,
  });
};

const getClient = () => contractWrappers;

module.exports = { configure, getClient };
