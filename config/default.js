module.exports = {
  bugsnag: {
    token: process.env.BUGSNAG_TOKEN || null,
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  maxChunkSize: 10000,
  minConfirmations: 12,
  pollingInterval: 30000,
  v1: {
    genesisBlock: 4145578,
  },
  v2: {
    genesisBlock: 6271590,
  },
  web3: {
    endpoint: process.env.WEB3_ENDPOINT,
    networkId: 1,
  },
};
