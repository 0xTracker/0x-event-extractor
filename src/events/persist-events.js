const { flow, map, reject } = require('lodash/fp');

const Event = require('../model/event');
const getEventData = require('./get-event-data');

const DODGY_ORDER_HASHES = [
  '0x1cbf70d8f6dfee99ee740f4e0e90a97e8e1f0c38a14b8604adadbe28469c0ffa',
];

const persistEvents = async (protocolVersion, events) => {
  const eventDocuments = flow(
    reject(event => DODGY_ORDER_HASHES.includes(event.args.orderHash)),
    map(event => ({
      blockNumber: parseInt(event.blockNumber, 10),
      data: getEventData(event),
      logIndex: event.logIndex,
      protocolVersion,
      transactionHash: event.transactionHash,
      type: event.event,
    })),
  )(events);

  if (eventDocuments.length > 0) {
    await Event.collection.insertMany(eventDocuments);
  }

  return eventDocuments.length;
};

module.exports = persistEvents;
