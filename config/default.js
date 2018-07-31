module.exports = {
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  genesisBlock: 4159599,
  maxChunkSize: 10000,
  minConfirmations: 12,
  pollingInterval: 30000,
  protocolVersion: 1,
  rollbar: {
    token: process.env.ROLLBAR_TOKEN,
  },
  web3: {
    endpoint: `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`,
    networkId: 1,
  },
};
