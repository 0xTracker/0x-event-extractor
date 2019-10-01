module.exports = {
  bugsnag: {
    token: process.env.BUGSNAG_TOKEN || null,
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  genesisBlock: {
    1: 4145578,
    2: 6271590,
  },
  maxChunkSize: 10000,
  minConfirmations: 12,
  pollingInterval: 30000,
  web3: {
    endpoint: process.env.WEB3_ENDPOINT,
    networkId: 1,
  },
};
