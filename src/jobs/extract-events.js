const { clamp } = require('lodash');

const _ = require('lodash');

const BlockRange = require('../model/block-range');
const getCurrentBlock = require('../util/ethereum/get-current-block');
const getLastProcessedBlock = require('../events/get-last-processed-block');
const persistEvents = require('../events/persist-events');
const zeroEx = require('../util/ethereum/0x');

const saveEvents = async () => {
  const currentBlock = await getCurrentBlock();
  const lastBlock = await getLastProcessedBlock();
  const fromBlock = lastBlock + 1;
  const toBlock = clamp(
    fromBlock + _.toNumber(process.env.MAX_CHUNK_SIZE),
    1,
    currentBlock - _.toNumber(process.env.MIN_CONFIRMATIONS),
  );

  console.log(`[zrx-tracker] current block is ${currentBlock}`);

  if (toBlock < fromBlock) {
    console.log('[zrx-tracker] no more blocks to process, skipping');
    return;
  }

  console.log(
    `[zrx-tracker] retrieving events from block ${fromBlock} to block ${toBlock}`,
  );

  const events = await zeroEx
    .getClient()
    .exchange.getLogsAsync('LogFill', { fromBlock, toBlock }, {});

  if (events.length > 0) {
    console.log(`[zrx-tracker] processing ${events.length} events`);
    await persistEvents(events);
    console.log(`[zrx-tracker] saved ${events.length} events`);
  } else {
    console.log('[zrx-tracker] no new events');
  }

  await BlockRange.findOneAndUpdate(
    { fromBlock, toBlock },
    {
      $set: {
        date: new Date(),
        events: events.length,
        fromBlock,
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
