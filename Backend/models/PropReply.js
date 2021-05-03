const mongoose = require('mongoose');

const PropReplySchema = new mongoose.Schema({
  date: {type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  comment: String,
  sources: [{ url: String }],
  replyCS: {type: Number, default: 0 },
  totalCS: {type: Number, default: 0 },
  totalPS: {type: Number, default: 0 },
  totalScore: {type: Number, default: 0 },
  performance: {type: Number, default: 10 },
  replyId: String,
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PropReply' }]
}, {collection: 'propreplies'});

const PropReply = mongoose.model('PropReply', PropReplySchema);

module.exports = PropReply;