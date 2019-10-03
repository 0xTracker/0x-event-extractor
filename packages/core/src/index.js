const { config } = require('@0x-event-extractor/shared');
const extractorV1 = require('@0x-event-extractor/extractor-v1');
const extractorV2 = require('@0x-event-extractor/extractor-v2');

const db = require('./util/db');
const jobRunner = require('./util/job-runner');
const jobs = require('./jobs');
const logger = require('./util/logger');
const web3 = require('../../shared/src/web3');

const configure = initialConfig => {
  config.init(initialConfig);
  db.connect(config.get('database.connectionString'));
  extractorV1.configure({ network: config.get('web3.network') });
  extractorV2.configure({ network: config.get('web3.network') });
  logger.configure({ bugsnagToken: config.get('bugsnag.token') });
  web3.configure({ endpoint: config.get('web3.endpoint') });
};

const start = () => {
  jobRunner.runJobs(jobs);
};

module.exports = { configure, start };
