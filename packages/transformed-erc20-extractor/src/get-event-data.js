const { web3 } = require('@0x-event-extractor/shared');

const getEventData = logEntry => {
  const decoded = web3.getWrapper().abiDecoder.tryToDecodeLogOrNoop(logEntry);

  const {
    inputToken,
    inputTokenAmount,
    outputToken,
    outputTokenAmount,
    taker,
  } = decoded.args;

  const eventData = {
    inputToken,
    inputTokenAmount: inputTokenAmount.toString(),
    outputToken,
    outputTokenAmount: outputTokenAmount.toString(),
    taker,
  };

  return eventData;
};

module.exports = getEventData;
