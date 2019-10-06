const delay = require('delay');
const withRetry = require('promise-poller').default;

const logger = require('./logger');

const repeatTask = (task, interval, maxRetries) =>
  withRetry({
    taskFn: task,
    interval,
    retries: maxRetries,
    progressCallback: (retriesRemaining, error) => logger.logError(error),
  })
    .then(() => delay(interval))
    .then(() => repeatTask(task, interval))
    .catch(() => {
      logger.logError(
        `Stopped running ${task.name} due to too many failures (${maxRetries}).`,
      );
    });

const runJobs = jobs => {
  jobs.forEach(job => repeatTask(job.fn, job.interval, job.maxRetries));
};

module.exports.runJobs = runJobs;
