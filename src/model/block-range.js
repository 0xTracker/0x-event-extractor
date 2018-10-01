const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  dateProcessed: Date,
  events: Number,
  fromBlock: Number,
  protocolVersion: { default: 1, index: true, type: Number },
  toBlock: { type: Number, index: true },
});

schema.index(
  { fromBlock: 1, toBlock: 1, protocolVersion: 1 },
  { unique: true },
);

const Model = mongoose.model('BlockRange', schema);

module.exports = Model;
