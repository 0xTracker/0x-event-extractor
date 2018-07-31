const _ = require('lodash');
const { flow, map, reject } = require('lodash/fp');

const Event = require('../model/event');
const getEventData = require('./get-event-data');
const web3 = require('../util/ethereum/web3');

const DODGY_ORDER_HASHES = [
  '0x1cbf70d8f6dfee99ee740f4e0e90a97e8e1f0c38a14b8604adadbe28469c0ffa',
];

const persistEvents = async (protocolVersion, events) => {
  const web3Client = web3.getClient();
  const eventDocuments = flow(
    reject(event => DODGY_ORDER_HASHES.includes(event.args.orderHash)),
    map(event => ({
      blockNumber: web3Client.toDecimal(event.blockNumber),
      data: getEventData(event),
      logIndex: event.logIndex,
      protocolVersion,
      transactionHash: event.transactionHash,
      type: event.event,
    })),
  )(events);

  try {
    await Event.collection.insert(eventDocuments);
  } catch (error) {
    // Ignore duplicate key errors
    if (_.isArray(error.writeErrors) && error.writeErrors[0].code !== 11000) {
      throw error;
    }
  }

  return eventDocuments.length;
};

module.exports = persistEvents;
