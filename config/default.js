const _ = require('lodash');

module.exports = {
  bugsnag: {
    token: _.get(process.env, 'BUGSNAG_TOKEN', null),
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  eventType: 'Fill',
  genesisBlock: 8136166,
  maxChunkSize: 10000,
  minConfirmations: 12,
  pollingInterval: 30000,
  protocolVersion: 2,
  rollbar: {
    token: _.get(process.env, 'ROLLBAR_TOKEN', null),
  },
  web3: {
    endpoint: `https://kovan.infura.io/${process.env.INFURA_API_KEY}`,
    networkId: 42,
  },
};
