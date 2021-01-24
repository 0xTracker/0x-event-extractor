const { web3 } = require('@0x-event-extractor/shared');

const getEventData = logEntry => {
  const decoded = web3.getWrapper().abiDecoder.tryToDecodeLogOrNoop(logEntry);

  const {
    maker,
    makerToken,
    makerTokenFilledAmount,
    orderHash,
    pool,
    taker,
    takerToken,
    takerTokenFilledAmount,
  } = decoded.args;

  const eventData = {
    maker,
    makerToken,
    makerTokenFilledAmount: makerTokenFilledAmount.toString(),
    orderHash,
    pool,
    taker,
    takerToken,
    takerTokenFilledAmount: takerTokenFilledAmount.toString(),
  };

  return eventData;
};

module.exports = getEventData;
