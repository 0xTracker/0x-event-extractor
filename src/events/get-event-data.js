const getEventData = event => ({
  ...event,
  args: {
    ...event.args,
    filledMakerTokenAmount: event.args.filledMakerTokenAmount.toNumber(),
    filledTakerTokenAmount: event.args.filledTakerTokenAmount.toNumber(),
    paidMakerFee: event.args.paidMakerFee.toNumber(),
    paidTakerFee: event.args.paidTakerFee.toNumber(),
  },
});

module.exports = getEventData;
