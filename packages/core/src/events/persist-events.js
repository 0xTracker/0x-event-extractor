const Event = require('../model/event');

const persistEvents = async events => {
  await Event.collection.insertMany(events);
};

module.exports = persistEvents;
