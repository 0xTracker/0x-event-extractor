const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  dateProcessed: { required: true, type: Date },
  events: { required: true, type: Number },
  eventType: { required: true, type: String },
  fromBlock: { required: true, type: Number },
  protocolVersion: { default: 1, required: true, type: Number },
  toBlock: { required: true, type: Number },
});

// Used for determining last processed block
schema.index({ protocolVersion: 1, toBlock: -1 });

// Used to enforce consistency in the data
schema.index(
  { fromBlock: 1, toBlock: 1, protocolVersion: 1 },
  { unique: true },
);

const BlockRange = mongoose.model('BlockRange', schema);

module.exports = BlockRange;
