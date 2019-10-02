require('dotenv-safe').config({
  example:
    process.env.NODE_ENV === 'production'
      ? '.env.prod.example'
      : '.env.example',
});

const config = require('config');
const extractorV1 = require('@0x-event-extractor/extractor-v1');
const extractorV2 = require('@0x-event-extractor/extractor-v2');

const db = require('./util/db');
const jobRunner = require('./util/job-runner');
const jobs = require('./jobs');
const logger = require('./util/logger');
const web3 = require('../../shared/src/web3');

db.connect(config.get('database.connectionString'));
extractorV1.configure({ network: config.get('web3.network') });
extractorV2.configure({ network: config.get('web3.network') });
logger.configure({ bugsnagToken: config.get('bugsnag.token') });
web3.configure({ endpoint: config.get('web3.endpoint') });

jobRunner.runJobs(jobs);
