const delay = require('delay');
const withRetry = require('promise-poller').default;

const logger = require('./logger');

const repeatTask = (task, { minInterval, maxInterval }) =>
  withRetry({
    max: maxInterval,
    min: minInterval,
    progressCallback: (retriesRemaining, error) => logger.logError(error),
    retries: 999999, // Setting a large number because poller does not work properly with Infinity
    strategy: 'exponential-backoff',
    taskFn: task,
  })
    .then(() => delay(minInterval))
    .then(() => repeatTask(task, { maxInterval, minInterval }))
    .catch(error => {
      logger.logError(error);
      logger.logError(`Stopped running ${task.name}.`);
    });

const runJobs = jobs => {
  jobs.forEach(job =>
    repeatTask(job.fn, {
      minInterval: job.minInterval,
      maxInterval: job.maxInterval,
    }),
  );
};

module.exports.runJobs = runJobs;
