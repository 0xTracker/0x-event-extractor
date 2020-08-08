const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema({
  blockNumber: { required: true, type: Number },
  data: { required: true, type: Schema.Types.Mixed },
  dateIngested: { required: true, type: Date },
  logIndex: { required: true, type: Number },
  protocolVersion: { default: 1, required: true, type: Number },
  transactionHash: { required: true, type: String },
  type: { required: true, type: String },
});

schema.index({ logIndex: 1, transactionHash: 1 }, { unique: true });

const Model = mongoose.model('Event', schema);

module.exports = Model;
