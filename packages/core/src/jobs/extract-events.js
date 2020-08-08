const fillExtractorV1 = require('@0x-event-extractor/extractor-v1');
const fillExtractorV2 = require('@0x-event-extractor/extractor-v2');
const fillExtractorV3 = require('@0x-event-extractor/extractor-v3');

const { getLogger } = require('../util/logging');
const BlockRange = require('../model/block-range');
const Event = require('../model/event');
const getCurrentBlock = require('../ethereum/get-current-block');
const getNextBlockRange = require('../events/get-next-block-range');
const withTransaction = require('../util/with-transaction');

const performExtraction = async (currentBlock, extractorConfig) => {
  const {
    eventType, // TODO: Query by this once we have data in blockranges collection
    fetchLogEntries,
    getEventData,
    protocolVersion,
  } = extractorConfig;

  // Scope all logging for the job to the specified protocol version and event type
  const logger = getLogger(`extract v${protocolVersion} ${eventType} events`);

  const rangeConfig = { currentBlock, protocolVersion }; // TODO: Also include event type
  const nextBlockRange = await getNextBlockRange(rangeConfig);

  if (nextBlockRange === null) {
    logger.info('no more blocks to process');
    return;
  }

  const { fromBlock, toBlock } = nextBlockRange;

  logger.info(`fetching events from blocks ${fromBlock}-${toBlock}`);

  const logEntries = await fetchLogEntries(fromBlock, toBlock);
  const entryCount = logEntries.length;

  if (entryCount === 0) {
    logger.info(`no events found in blocks ${fromBlock}-${toBlock}`);
  } else {
    logger.info(`${entryCount} events found in blocks ${fromBlock}-${toBlock}`);
  }

  /**
   * Persistence operations are wrapped in a transaction to ensure consistency
   * between the BlockRange and Event collections. If a document exists within
   * the BlockRange collection, then we can assume that all the associated
   * events will exist in the Event collection.
   */
  await withTransaction(async session => {
    if (logEntries.length > 0) {
      const events = logEntries.map(logEntry => ({
        blockNumber: logEntry.blockNumber,
        data: getEventData(logEntry),
        dateIngested: new Date(),
        logIndex: logEntry.logIndex,
        protocolVersion,
        transactionHash: logEntry.transactionHash,
        type: eventType,
      }));

      await Event.insertMany(events, { session });
    }

    /**
     * Log details of the queried block range in MongoDB. This provides
     * two functions:
     *
     * 1. History of scraping activity for debugging
     * 2. An indicator for where to scrape from on the next iteration
     *
     * If collection size became an issue then the BlockRange collection
     * could be safely capped at say 100,000 documents.
     */
    await BlockRange.create(
      [
        {
          dateProcessed: new Date(),
          events: logEntries.length,
          eventType,
          fromBlock,
          protocolVersion,
          toBlock,
        },
      ],
      { session },
    );
  });

  if (logEntries.length > 0) {
    logger.info(`persisted ${logEntries.length} events to database`);
  }
};

const extractEvents = async () => {
  const logger = getLogger('event extractor');

  logger.info('beginning event extraction');
  logger.info('fetching current block');

  const currentBlock = await getCurrentBlock();

  logger.info(`current block is ${currentBlock}`);

  /**
   * Extractors are run sequentially to help avoid issues with rate
   * limiting in the Ethereum RPC provider.
   */
  await performExtraction(currentBlock, fillExtractorV1);
  await performExtraction(currentBlock, fillExtractorV2);
  await performExtraction(currentBlock, fillExtractorV3);

  logger.info('finished event extraction');
};

module.exports = extractEvents;
