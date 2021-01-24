const { config } = require('@0x-event-extractor/shared');
const fillExtractorV1 = require('@0x-event-extractor/fill-extractor-v1');
const fillExtractorV2 = require('@0x-event-extractor/fill-extractor-v2');
const fillExtractorV3 = require('@0x-event-extractor/fill-extractor-v3');
const limitOrderFilledExtractor = require('@0x-event-extractor/limit-order-filled-extractor');
const liquidityProviderSwapExtractor = require('@0x-event-extractor/liquidity-provider-swap-extractor');
const rfqOrderFilledExtractor = require('@0x-event-extractor/rfq-order-filled-extractor');
const sushiswapSwapExtractor = require('@0x-event-extractor/sushiswap-swap-extractor');
const transformedERC20Extractor = require('@0x-event-extractor/transformed-erc20-extractor');
const uniswapV2Extractor = require('@0x-event-extractor/uniswap-v2-swap-extractor');

const { getLogger } = require('../util/logging');
const BlockRange = require('../model/block-range');
const Event = require('../model/event');
const getBlock = require('../ethereum/get-block');
const getCurrentBlock = require('../ethereum/get-current-block');
const getNextBlockRange = require('../events/get-next-block-range');
const withTransaction = require('../util/with-transaction');

const performExtraction = async (maxBlockNumber, extractorConfig) => {
  const {
    eventType,
    fetchLogEntries,
    getEventData,
    protocolVersion,
  } = extractorConfig;

  // Scope all logging for the job to the specified protocol version and event type
  const logger = getLogger(`extract v${protocolVersion} ${eventType} events`);

  const rangeConfig = { eventType, maxBlockNumber, protocolVersion };
  const nextBlockRange = await getNextBlockRange(rangeConfig);

  if (nextBlockRange === null) {
    logger.info('no more blocks to process');
    return;
  }

  logger.info(
    `${maxBlockNumber -
      nextBlockRange.fromBlock} block(s) waiting to be processed`,
  );

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

const determineMaxQueryableBlock = currentBlock => {
  const minConfirmations = config.get('minConfirmations');
  const maxBlock = currentBlock - minConfirmations;

  return maxBlock;
};

const extractEvents = async () => {
  const logger = getLogger('event extractor');

  logger.info('beginning event extraction');
  logger.info('fetching current block');

  const currentBlockNumber = await getCurrentBlock();
  const maxBlockNumber = determineMaxQueryableBlock(currentBlockNumber);

  logger.info(`current block is ${currentBlockNumber}`);
  logger.info(`max block is ${maxBlockNumber}`);

  /**
   * Extractors are run sequentially to help avoid issues with rate
   * limiting in the Ethereum RPC provider.
   */
  await performExtraction(maxBlockNumber, fillExtractorV1);
  await performExtraction(maxBlockNumber, fillExtractorV2);
  await performExtraction(maxBlockNumber, fillExtractorV3);
  await performExtraction(maxBlockNumber, transformedERC20Extractor);
  await performExtraction(maxBlockNumber, rfqOrderFilledExtractor);
  await performExtraction(maxBlockNumber, liquidityProviderSwapExtractor);
  await performExtraction(maxBlockNumber, limitOrderFilledExtractor);

  const maxBlock = await getBlock(maxBlockNumber);

  await performExtraction(maxBlock.timestamp, uniswapV2Extractor);
  await performExtraction(maxBlock.timestamp, sushiswapSwapExtractor);

  logger.info('finished event extraction');
};

module.exports = extractEvents;
