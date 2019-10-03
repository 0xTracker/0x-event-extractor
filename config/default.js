module.exports = {
  bugsnag: {
    token: process.env.BUGSNAG_TOKEN || null,
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  maxChunkSize: parseInt(process.env.MAX_CHUNK_SIZE, 10),
  minConfirmations: 12,
  pollingInterval: parseInt(process.env.POLLING_INTERVAL, 10),
  v1: {
    genesisBlock: 4145578,
  },
  v2: {
    genesisBlock: 8140780,
  },
  web3: {
    endpoint: process.env.WEB3_ENDPOINT,
    networkId: 1,
  },
};
