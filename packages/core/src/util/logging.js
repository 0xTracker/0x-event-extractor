const _ = require('lodash');
const os = require('os');
const pino = require('pino');
const pinoElastic = require('pino-elasticsearch');

let logger;

const createIndexFormatter = prefix => logTime => {
  const date = new Date(logTime);
  const year = date.getUTCFullYear();
  const month = _.padStart(date.getUTCMonth() + 1, 2, 0);
  const day = _.padStart(date.getUTCDate(), 2, 0);

  // Log indexes roll over every day
  return `${prefix}_${year}_${month}_${day}`;
};

const init = config => {
  const streamToElasticsearch =
    config.elasticsearch.url === null || config.elasticsearch.url.length === 0
      ? undefined
      : pinoElastic({
          'bulk-size': config.elasticsearch.batchSize,
          consistency: 'one',
          ecs: true,
          index: createIndexFormatter(config.elasticsearch.index),
          node: config.elasticsearch.url,
          type: 'log',
        });

  logger = pino(
    {
      base: { group: 'application', pid: process.pid, hostname: os.hostname() },
      level: 'info',
    },
    streamToElasticsearch,
  );
};

const getLogger = logGroup => {
  if (logGroup !== undefined) {
    return logger.child({ group: logGroup });
  }

  return logger;
};

module.exports = { getLogger, init };
