const BLACKLISTED_ORDER_HASHES = [
  '0x1cbf70d8f6dfee99ee740f4e0e90a97e8e1f0c38a14b8604adadbe28469c0ffa',
];

const getEventData = event => ({
  ...event,
  args: {
    ...event.args,
    makerAssetFilledAmount: event.args.makerAssetFilledAmount.toNumber(),
    takerAssetFilledAmount: event.args.takerAssetFilledAmount.toNumber(),
    makerFeePaid: event.args.makerFeePaid.toNumber(),
    takerFeePaid: event.args.takerFeePaid.toNumber(),
  },
});

const fetchEvents = () => {
  throw new Error('Not yet implemented');
};

const extractEvents = async (fromBlock, toBlock) => {
  const events = fetchEvents(fromBlock, toBlock);
  const eventModels = events
    .filter(
      event =>
        BLACKLISTED_ORDER_HASHES.includes(event.args.orderHash) === false,
    )
    .map(event => ({
      blockNumber: parseInt(event.blockNumber, 10),
      data: getEventData(event),
      logIndex: event.logIndex,
      protocolVersion: 1,
      transactionHash: event.transactionHash,
      type: event.event,
    }));

  return eventModels;
};

module.exports = { extractEvents };
