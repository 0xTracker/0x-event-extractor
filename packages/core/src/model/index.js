const BlockRange = require('./block-range');
const Event = require('./event');

const init = async () => {
  BlockRange.createCollection();
  Event.createCollection();
};

module.exports = { BlockRange, Event, init };
