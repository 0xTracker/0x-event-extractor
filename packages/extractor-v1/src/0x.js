const { ZeroEx } = require('0x.js');
const { web3 } = require('@0x-event-extractor/shared');

let client;

const getClient = () => {
  return client;
};

const configure = options => {
  client = new ZeroEx(web3.getProviderEngine(), {
    networkId: options.networkId,
  });
};

module.exports = {
  configure,
  getClient,
};
