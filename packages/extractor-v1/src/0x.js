const { ZeroEx } = require('0x.js');

let client;

const getClient = () => {
  return client;
};

const configure = options => {
  client = new ZeroEx(getProviderEngine(), {
    networkId: options.networkId,
  }).getClient();
};

module.exports = {
  configure,
  getClient,
};
