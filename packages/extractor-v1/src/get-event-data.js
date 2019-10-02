const getEventData = logEntry => ({
  ...logEntry,
  args: {
    ...logEntry.args,
    filledMakerTokenAmount: logEntry.args.filledMakerTokenAmount.toNumber(),
    filledTakerTokenAmount: logEntry.args.filledTakerTokenAmount.toNumber(),
    paidMakerFee: logEntry.args.paidMakerFee.toNumber(),
    paidTakerFee: logEntry.args.paidTakerFee.toNumber(),
  },
});

module.exports = getEventData;
