const extractorV1 = require('@0x-event-extractor/extractor-v1');
const extractorV2 = require('@0x-event-extractor/extractor-v2');
const signale = require('signale');

const BlockRange = require('../model/block-range');
const Event = require('../model/event');
const getCurrentBlock = require('../ethereum/get-current-block');
const getNextBlockRange = require('../events/get-next-block-range');
const withTimer = require('../util/with-timer');
const withTransaction = require('../util/with-transaction');

const extractEventsForProtocol = async (protocolVersion, extractorConfig) => {
  // Scope all logging for the job to the specified protocol version
  const logger = signale.scope(`extract events v${protocolVersion}`);

  // Determine which blocks we should fetch log entries from
  const { currentBlock, fetchLogEntries, getEventData } = extractorConfig;
  const nextBlockRange = await getNextBlockRange({
    currentBlock,
    protocolVersion,
  });

  logger.info(`current block is ${currentBlock}`);

  if (nextBlockRange === null) {
    logger.info('no more blocks to process');
    return;
  }

  const { fromBlock, toBlock } = nextBlockRange;

  logger.info(`next block range is ${fromBlock} to ${toBlock}`);

  const logEntries = await withTimer(logger, `fetch entries`, () =>
    fetchLogEntries(fromBlock, toBlock),
  );

  if (logEntries.length === 0) {
    logger.info(`no entries were found`);
  } else {
    logger.info(`${logEntries.length} entries were found`);
  }

  // Persistence operations are wrapped in a transaction to ensure consistency
  await withTransaction(async session => {
    if (logEntries.length > 0) {
      // Map the log entries to a common model before persisting to MongoDB
      const events = logEntries.map(logEntry => ({
        blockNumber: logEntry.blockNumber,
        data: getEventData(logEntry),
        logIndex: logEntry.logIndex,
        protocolVersion,
        transactionHash: logEntry.transactionHash,
        type: logEntry.event,
      }));

      await withTimer(logger, `persist ${events.length} events`, async () => {
        await Event.insertMany(events, { session });
      });
    }

    // Log details of the queried block range so that we know where
    // to start from in the next iteration.
    await withTimer(logger, 'log queried block range', async () => {
      await BlockRange.findOneAndUpdate(
        { fromBlock, protocolVersion, toBlock },
        {
          $set: {
            date: new Date(),
            events: logEntries.length,
            fromBlock,
            protocolVersion,
            toBlock,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          session,
        },
      );
    });
  });
};

const extractEvents = async () => {
  const currentBlock = await getCurrentBlock();

  // Fetching of events is delegated to version specific extractors which
  // interact with the correct SDK and contract.
  await extractEventsForProtocol(1, { currentBlock, ...extractorV1 });
  await extractEventsForProtocol(2, { currentBlock, ...extractorV2 });
};

module.exports = extractEvents;
