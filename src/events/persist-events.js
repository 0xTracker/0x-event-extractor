const _ = require('lodash');
const { compact, flow, map } = require('lodash/fp');

const Event = require('../model/event');
const web3 = require('../util/ethereum/web3');

const EXCLUDE_ORDERS = [
  '0x1cbf70d8f6dfee99ee740f4e0e90a97e8e1f0c38a14b8604adadbe28469c0ffa',
];

const getEventData = (protocolVersion, event) => {
  if (protocolVersion !== 1) {
    throw new Error(`Events from v${protocolVersion} are not supported.`);
  }

  return {
    ...event,
    args: {
      ...event.args,
      filledMakerTokenAmount: event.args.filledMakerTokenAmount.toNumber(),
      filledTakerTokenAmount: event.args.filledTakerTokenAmount.toNumber(),
      paidMakerFee: event.args.paidMakerFee.toNumber(),
      paidTakerFee: event.args.paidTakerFee.toNumber(),
    },
  };
};

const persistEvents = async (protocolVersion, events) => {
  const web3Client = web3.getClient();
  const eventModels = flow(
    map(
      event =>
        EXCLUDE_ORDERS.includes(event.args.orderHash)
          ? null
          : {
              blockNumber: web3Client.toDecimal(event.blockNumber),
              data: getEventData(protocolVersion, event),
              logIndex: event.logIndex,
              protocolVersion,
              transactionHash: event.transactionHash,
              type: event.event,
            },
    ),
    compact(),
  )(events);

  try {
    await Event.collection.insert(eventModels);
  } catch (error) {
    // Ignore duplicate key errors
    if (_.isArray(error.writeErrors) && error.writeErrors[0].code !== 11000) {
      throw error;
    }
  }

  return eventModels.length;
};

module.exports = persistEvents;
