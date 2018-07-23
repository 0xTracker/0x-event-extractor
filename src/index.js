const _ = require('lodash');
const dotenv = require('dotenv');

const { runJobs } = require('./util/job-runner');
const db = require('./util/db');
const jobs = require('./jobs');
const logger = require('./util/logger');
const web3 = require('./util/ethereum/web3');
const zeroEx = require('./util/ethereum/0x.js');

dotenv.config();

logger.configure({ rollbarToken: process.env.ROLLBAR_TOKEN_POLLER });
web3.configure({ endpoint: process.env.WEB3_ENDPOINT });
zeroEx.configure({ networkId: _.toNumber(process.env.NETWORK_ID) });
db.connect(process.env.MONGODB_CONNECTION_STRING);

runJobs(jobs);
