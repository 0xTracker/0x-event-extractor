const { clamp } = require('lodash');

const config = require('config');

const BlockRange = require('../model/block-range');
const getCurrentBlock = require('../util/ethereum/get-current-block');
const getLastProcessedBlock = require('../events/get-last-processed-block');
const persistEvents = require('../events/persist-events');
const zeroEx = require('../util/ethereum/0x');

const getEvents = async (protocolVersion, fromBlock, toBlock) => {
  if (protocolVersion !== 1) {
    throw new Error(`Events from v${protocolVersion} are not supported.`);
  }

  const events = await zeroEx
    .getClient()
    .exchange.getLogsAsync('LogFill', { fromBlock, toBlock }, {});

  return events;
};

const saveEvents = async () => {
  const protocolVersion = config.get('protocolVersion');
  const currentBlock = await getCurrentBlock();
  const maxBlock = currentBlock - config.get('minConfirmations');
  const lastBlock = await getLastProcessedBlock(protocolVersion);
  const fromBlock = lastBlock + 1;
  const toBlock = clamp(fromBlock + config.get('maxChunkSize'), 1, maxBlock);

  console.log(`[zrx-tracker] current block is ${currentBlock}`);

  if (toBlock < fromBlock) {
    console.log('[zrx-tracker] no more blocks to process, skipping');
    return;
  }

  console.log(
    `[zrx-tracker] retrieving events from block ${fromBlock} to block ${toBlock}`,
  );

  const events = await getEvents(protocolVersion, fromBlock, toBlock);

  if (events.length > 0) {
    console.log(`[zrx-tracker] processing ${events.length} events`);
    const savedCount = await persistEvents(protocolVersion, events);
    console.log(
      `[zrx-tracker] saved ${savedCount} events, ${events.length -
        savedCount} were ignored`,
    );
  } else {
    console.log('[zrx-tracker] no new events');
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
