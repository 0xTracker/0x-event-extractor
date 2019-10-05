const { RPCSubprovider, Web3ProviderEngine } = require('@0x/subproviders');
const { Web3Wrapper } = require('@0x/web3-wrapper');
const { providerUtils } = require('@0x/utils');

let wrapper;
let providerEngine;

const configure = ({ endpoint }) => {
  providerEngine = new Web3ProviderEngine();
  wrapper = new Web3Wrapper(providerEngine);

  providerEngine.addProvider(new RPCSubprovider(endpoint));
  providerUtils.startProviderEngine(providerEngine);
};

const getWrapper = () => wrapper;
const getProviderEngine = () => providerEngine;

module.exports = { configure, getProviderEngine, getWrapper };
