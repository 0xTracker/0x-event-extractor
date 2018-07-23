const Web3 = require('web3');

let client;
let provider;

const configure = ({ endpoint }) => {
  provider = new Web3.providers.HttpProvider(endpoint);
  client = new Web3(provider);
};

const getClient = () => client;

const getProvider = () => provider;

module.exports = { configure, getClient, getProvider };
