const { config } = require('@0x-event-extractor/shared');
const extractorV1 = require('@0x-event-extractor/fill-extractor-v1');
const extractorV2 = require('@0x-event-extractor/fill-extractor-v2');
const extractorV3 = require('@0x-event-extractor/fill-extractor-v3');

const db = require('./util/db');
const errorLogger = require('./util/error-logger');
const getJobs = require('./jobs');
const jobRunner = require('./util/job-runner');
const logging = require('./util/logging');
const model = require('./model');
const web3 = require('../../shared/src/web3');

const configure = async initialConfig => {
  config.init(initialConfig);
  logging.init(config.get('pino'));
  errorLogger.configure({
    bugsnagToken: config.get('bugsnag.token'),
  });
  await db.connect(config.get('database.connectionString'));
  await model.init();
  web3.configure({ endpoint: config.get('web3.endpoint') });
  extractorV1.configure({ networkId: config.get('web3.networkId') });
  extractorV2.configure({ networkId: config.get('web3.networkId') });
  extractorV3.configure({ chainId: config.get('web3.networkId') });
};

const start = () => {
  jobRunner.runJobs(getJobs());
};

module.exports = { configure, start };
