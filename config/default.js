module.exports = {
  bugsnag: {
    token: process.env.BUGSNAG_TOKEN || null,
  },
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  maxChunkSize: parseInt(process.env.MAX_CHUNK_SIZE, 10),
  maxPollingInterval: parseInt(process.env.MAX_POLLING_INTERVAL, 10),
  minConfirmations: 12,
  minPollingInterval: parseInt(process.env.MIN_POLLING_INTERVAL, 10),
  pino: {
    elasticsearch: {
      batchSize: 200,
      index: 'logs_event_extractor',
      url: process.env.PINO_ELASTIC_SEARCH_URL || null,
    },
  },
  v1: {
    genesisBlock: 4145578,
  },
  v2: {
    genesisBlock: 8140780,
  },
  v3: {
    genesisBlock: 8952139,
  },
  web3: {
    endpoint: process.env.WEB3_ENDPOINT,
    networkId: 1,
  },
};
