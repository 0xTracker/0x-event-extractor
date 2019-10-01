require('dotenv-safe').config({
  example:
    process.env.NODE_ENV === 'production'
      ? '.env.prod.example'
      : '.env.example',
});

const config = require('config');

const { runJobs } = require('./util/job-runner');
const db = require('./util/db');
const jobs = require('./jobs');
const logger = require('./util/logger');
const web3 = require('./ethereum/web3');

logger.configure({
  bugsnagToken: config.get('bugsnag.token'),
});

web3.configure({ endpoint: config.get('web3.endpoint') });

db.connect(config.get('database.connectionString'));

runJobs(jobs);
