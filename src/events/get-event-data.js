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

module.exports = getEventData;
