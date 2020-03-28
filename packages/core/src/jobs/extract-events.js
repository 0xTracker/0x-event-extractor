const extractorV1 = require('@0x-event-extractor/extractor-v1');
const extractorV2 = require('@0x-event-extractor/extractor-v2');
const extractorV3 = require('@0x-event-extractor/extractor-v3');

const { getLogger } = require('../util/logging');
const BlockRange = require('../model/block-range');
const Event = require('../model/event');
const getCurrentBlock = require('../ethereum/get-current-block');
const getNextBlockRange = require('../events/get-next-block-range');
const withTransaction = require('../util/with-transaction');

const extractEventsForProtocol = async (protocolVersion, extractorConfig) => {
  // Scope all logging for the job to the specified protocol version
  const logger = getLogger(`extract events v${protocolVersion}`);

  // Determine which blocks we should fetch log entries from
  const { currentBlock, fetchLogEntries, getEventData } = extractorConfig;

  logger.info(`current block is ${currentBlock}`);

  const nextBlockRange = await getNextBlockRange({
    currentBlock,
    protocolVersion,
  });

  if (nextBlockRange === null) {
    logger.info('no more blocks to process');
    return;
  }

  const { fromBlock, toBlock } = nextBlockRange;

  logger.info(`fetching events from block range ${fromBlock} to ${toBlock}`);

  const logEntries = await fetchLogEntries(fromBlock, toBlock);

  if (logEntries.length === 0) {
    logger.info(`no events found in block range ${fromBlock} to ${toBlock}`);
  } else {
    logger.info(
      `${logEntries.length} events found in block range ${fromBlock} to ${toBlock}`,
    );
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

      await Event.insertMany(events, { session });
    }

    // Log details of the queried block range so that we know where
    // to start from in the next iteration.
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

  if (logEntries.length > 0) {
    logger.info(`persisted ${logEntries.length} events to database`);
  }
};

const extractEvents = async () => {
  const currentBlock = await getCurrentBlock();

  // Fetching of events is delegated to version specific extractors which
  // interact with the correct 0x SDK version and contract.
  await extractEventsForProtocol(1, { currentBlock, ...extractorV1 });
  await extractEventsForProtocol(2, { currentBlock, ...extractorV2 });
  await extractEventsForProtocol(3, { currentBlock, ...extractorV3 });
};

module.exports = extractEvents;
