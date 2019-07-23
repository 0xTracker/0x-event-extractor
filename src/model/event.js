const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  blockNumber: Number,
  data: { type: Schema.Types.Mixed },
  fillCreated: { type: Boolean, index: true, default: false },
  logIndex: Number,
  protocolVersion: { default: 1, type: Number },
  transactionHash: String,
  type: String,
});

schema.index({ logIndex: 1, transactionHash: 1 }, { unique: true });

const Model = mongoose.model('Event', schema);

module.exports = Model;
