const withTimer = async (logger, logMessage, func) => {
  logger.time(logMessage);
  const result = await func();
  logger.timeEnd(logMessage);

  return result;
};

module.exports = withTimer;
