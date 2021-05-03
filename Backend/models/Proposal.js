const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now },
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  authorName: String,
  authorData: {
    title: String,
    summary: String,
    sources: [{ url: String }],
    funding: {type: Number, default: 0 },
    influence: {type: Number, default: 0 },
    category: [{
      name: String,
      catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      reason: String,
      importance: {type: Number, default: 0 }
    }],
    authorTotalPS: {type: Number, default: 0 },
    authorTotalCS: {type: Number, default: 0 },
    authorTotalScore: {type: Number, default: 0 },
    catRelatedCS: {type: Number, default: 0 },
    catRelatedPS: {type: Number, default: 0 },
    catRelatedScore: {type: Number, default: 0 },
    estimatedReturn: {type: Number, default: 0 }
  },
  postIds: [{
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // resulting posts
    influence: {type: Number, default: 0 }
  }],
  bids: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    funding: {type: Number, default: 0 },
    influence: {type: Number, default: 0 }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    comment: String,
    sources: [{ url: String }],
    category: [{
      name: String,
      catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      reason: String,
      importance: {type: Number, default: 0 }
    }],
    totalCS: {type: Number, default: 0 },
    totalPS: {type: Number, default: 0 },
    totalScore: {type: Number, default: 0 },
    performance: {type: Number, default: 10 },
    estimatedReturn: {type: Number, default: 0 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PropReply' }]
  }],
  category: [{
    name: String,
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    importance: {type: Number, default: 0 },
    baseScore: {type: Number, default: 0 }, // baseScore / totalScore ratio to get actual importance
  }],
  totalScore: {type: Number, default: 0 }, // cumulative score of all users
  userCS: {type: Number, default: 0 }, // based on catRelatedCS 
  estimatedPS: {type: Number, default: 0 }, // based on catRelatedPS
  estimatedReturn: {type: Number, default: 0 }, // catRelatedCS * catRelatedPS
}, {collection: 'proposals'});

const Proposal = mongoose.model('Proposal', ProposalSchema);

module.exports = Proposal;