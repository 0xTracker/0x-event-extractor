const { ZeroEx } = require('0x.js');

const { getProvider } = require('./web3');

let client;

const configure = ({ networkId }) => {
  client = new ZeroEx(getProvider(), { networkId });
};

const getClient = () => client;

module.exports = { configure, getClient };
