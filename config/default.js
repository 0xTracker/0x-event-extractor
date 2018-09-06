const _ = require('lodash');

module.exports = {
  bugsnag: {
    token: _.get(process.env, 'BUGSNAG_TOKEN', null),
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  eventType: 'LogFill',
  genesisBlock: 4145578,
  maxChunkSize: 10000,
  minConfirmations: 12,
  pollingInterval: 30000,
  protocolVersion: 1,
  web3: {
    endpoint: `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`,
    networkId: 1,
  },
};
