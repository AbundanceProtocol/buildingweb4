const mongoose = require('mongoose');

const ComSentenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  post: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
  },
  date: {type: Date, default: Date.now },
  comId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Comment' 
  },
  senId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
  },
  replyId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'ComSentence' 
  },
  comType: String,  // 'reply', 'comment'
  content: String,
  cs: {type: Number, default: 0 },
  importance: {type: Number, default: 0 },
  tone: String,
  comment: String,
  score: {type: Number, default: 0 }, //comment score // totalScore
  userScore: {type: Number, default: 0 }, //raw user score only
  confidence: {type: Number, default: 10 },
  userConfidence: {type: Number, default: 10 }, //user score only
  denominator: {type: Number, default: 0 }, //add scores
  sources: [{url: String}],
  responses: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'ComSentence' 
  }]
}, {collection: 'sentences'});

const ComSentence = mongoose.model('ComSentence', ComSentenceSchema);

module.exports = ComSentence;