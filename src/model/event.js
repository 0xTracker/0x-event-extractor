const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  blockNumber: { type: Number, index: true },
  data: { type: Schema.Types.Mixed },
  fillCreated: { type: Boolean, index: true, default: false },
  logIndex: { type: Number, index: true },
  transactionHash: { type: String, index: true },
  type: String,
});

schema.index({ logIndex: 1, transactionHash: 1 }, { unique: true });

const Model = mongoose.model('Event', schema);

module.exports = Model;
