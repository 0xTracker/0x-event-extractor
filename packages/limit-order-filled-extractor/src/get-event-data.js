const { web3 } = require('@0x-event-extractor/shared');

const getEventData = logEntry => {
  const decoded = web3.getWrapper().abiDecoder.tryToDecodeLogOrNoop(logEntry);

  const {
    feeRecipient,
    maker,
    makerToken,
    makerTokenFilledAmount,
    orderHash,
    pool,
    protocolFeePaid,
    taker,
    takerToken,
    takerTokenFeeFilledAmount,
    takerTokenFilledAmount,
  } = decoded.args;

  const eventData = {
    feeRecipient,
    maker,
    makerToken,
    makerTokenFilledAmount: makerTokenFilledAmount.toString(),
    orderHash,
    pool,
    protocolFeePaid: protocolFeePaid.toString(),
    taker,
    takerToken,
    takerTokenFeeFilledAmount: takerTokenFeeFilledAmount.toString(),
    takerTokenFilledAmount: takerTokenFilledAmount.toString(),
  };

  return eventData;
};

module.exports = getEventData;
