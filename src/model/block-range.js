const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  dateProcessed: Date,
  events: Number,
  fromBlock: Number,
  protocolVersion: { default: 1, type: Number },
  toBlock: Number,
});

// Used for determining last processed block
schema.index({ protocolVersion: 1, toBlock: -1 });

schema.index(
  { fromBlock: 1, toBlock: 1, protocolVersion: 1 },
  { unique: true },
);

const Model = mongoose.model('BlockRange', schema);

module.exports = Model;
