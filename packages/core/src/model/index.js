const BlockRange = require('./block-range');
const Event = require('./event');

const init = async () => {
  await BlockRange.createCollection();
  await Event.createCollection();
};

module.exports = { BlockRange, Event, init };
