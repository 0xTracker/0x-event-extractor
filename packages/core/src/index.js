const { config } = require('@0x-event-extractor/shared');
const extractorV1 = require('@0x-event-extractor/extractor-v1');
const extractorV2 = require('@0x-event-extractor/extractor-v2');
const extractorV3 = require('@0x-event-extractor/extractor-v3');

const db = require('./util/db');
const errorLogger = require('./util/error-logger');
const getJobs = require('./jobs');
const jobRunner = require('./util/job-runner');
const web3 = require('../../shared/src/web3');

const configure = async initialConfig => {
  config.init(initialConfig);
  errorLogger.configure({
    bugsnagToken: config.get('bugsnag.token'),
  });
  await db.connect(config.get('database.connectionString'));
  web3.configure({ endpoint: config.get('web3.endpoint') });
  extractorV1.configure({ networkId: config.get('web3.networkId') });
  extractorV2.configure({ networkId: config.get('web3.networkId') });
  extractorV3.configure({ chainId: config.get('web3.networkId') });
};

const start = () => {
  jobRunner.runJobs(getJobs());
};

module.exports = { configure, start };
