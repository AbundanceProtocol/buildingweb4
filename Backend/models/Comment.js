const mongoose = require('mongoose');
const ComSentence = require('../models/ComSentence');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
  },
  post: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
  },
  date: {type: Date, default: Date.now },
  postType: String,
  title: {
    content: String,
    cs: {type: Number, default: 0 },
    importance: {type: Number, default: 10 },
    tone: String,
    comment: String,
    sources: [String]
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  sentence: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'ComSentence' 
  }],
  context: {
    cs: {type: Number, default: 0 },
    importance: {type: Number, default: 10 },
    comment: String,
    sources: [{
      url: String,
      sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    }]
  },
  score: {type: Number, default: 0 },
  CS: {type: Number, default: 0 },
  PS: {type: Number, default: 0 },
  influence: [{
    percent: {type: Number, default: 0 },
    score: {type: Number, default: 0 },
    explanation: String,
    infId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
  }],
  category: [{
    rank: {type: Number, default: 0 },
    score: {type: Number, default: 0 },
    explanation: String,
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  }],
  timeStamp: Date,
  responses: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'ComSentence' 
  }],
  catCS: [Number],
  catPS: [Number],
  catValue: [Number]
}, {collection: 'comments'});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;