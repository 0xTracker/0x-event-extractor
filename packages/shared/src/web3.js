const { RPCSubprovider, Web3ProviderEngine } = require('@0x/subproviders');
const { Web3Wrapper } = require('@0x/web3-wrapper');

let wrapper;
let providerEngine;

const configure = ({ endpoint }) => {
  providerEngine = new Web3ProviderEngine();

  providerEngine.addProvider(new RPCSubprovider(endpoint));
  providerEngine.start();

  wrapper = new Web3Wrapper(providerEngine);
};

const getWrapper = () => wrapper;
const getProviderEngine = () => providerEngine;

module.exports = { configure, getProviderEngine, getWrapper };
