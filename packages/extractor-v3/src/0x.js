const { ContractWrappers } = require('@0x/contract-wrappers');
const { web3 } = require('@0x-event-extractor/shared');

let contractWrappers;

const configure = ({ chainId }) => {
  contractWrappers = new ContractWrappers(web3.getProviderEngine(), {
    chainId,
  });
};

const getClient = () => contractWrappers;

module.exports = { configure, getClient };
