const { clamp } = require('lodash');

const config = require('config');
const signale = require('signale');

const BlockRange = require('../model/block-range');
const getCurrentBlock = require('../util/ethereum/get-current-block');
const getLastProcessedBlock = require('../events/get-last-processed-block');
const persistEvents = require('../events/persist-events');
const zeroEx = require('../util/ethereum/0x');

const logger = signale.scope('extract events');

const getEvents = async (protocolVersion, fromBlock, toBlock) => {
  const events = await zeroEx
    .getClient()
    .exchange.getLogsAsync(config.get('eventType'), { fromBlock, toBlock }, {});

  return events;
};

const saveEvents = async () => {
  const protocolVersion = config.get('protocolVersion');
  const currentBlock = await getCurrentBlock();
  const maxBlock = currentBlock - config.get('minConfirmations');
  const lastBlock = await getLastProcessedBlock(protocolVersion);
  const fromBlock = lastBlock + 1;
  const toBlock = clamp(fromBlock + config.get('maxChunkSize'), 1, maxBlock);

  logger.note(`current block is ${currentBlock}`);

  if (toBlock < fromBlock) {
    logger.info('no more blocks to process');
    return;
  }

  logger.await(`retrieving events from block ${fromBlock} to block ${toBlock}`);

  const events = await getEvents(protocolVersion, fromBlock, toBlock);

  if (events.length > 0) {
    logger.await(`processing ${events.length} events`);

    const savedCount = await persistEvents(protocolVersion, events);

    logger.success(
      `saved ${savedCount} events, ${events.length - savedCount} were ignored`,
    );
  } else {
    logger.info('no events were found');
  }

  await BlockRange.findOneAndUpdate(
    { fromBlock, protocolVersion, toBlock },
    {
      $set: {
        date: new Date(),
        events: events.length,
        fromBlock,
        protocolVersion,
        toBlock,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );
};

module.exports = saveEvents;
