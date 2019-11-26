const getEventData = logEntry => ({
  ...logEntry,
  args: {
    ...logEntry.args,
    makerAssetFilledAmount: logEntry.args.makerAssetFilledAmount.toNumber(),
    takerAssetFilledAmount: logEntry.args.takerAssetFilledAmount.toNumber(),
    makerFeePaid: logEntry.args.makerFeePaid.toNumber(),
    protocolFeePaid: logEntry.args.protocolFeePaid.toNumber(),
    takerFeePaid: logEntry.args.takerFeePaid.toNumber(),
  },
});

module.exports = getEventData;
