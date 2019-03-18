const { ZeroEx } = require('0x.js');

const { getProviderEngine } = require('./web3');

let client;

const configure = ({ networkId }) => {
  client = new ZeroEx(getProviderEngine(), { networkId });
};

const getClient = () => client;

module.exports = { configure, getClient };
