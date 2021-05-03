const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  url: String,
  postType: String,
  date: {type: Date, default: Date.now },
  author: [{ 
    authId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    score: {type: Number, default: 0 }
  }],
  title: {
    content: String,
    cs: {type: Number, default: 0 },
    importance: {type: Number, default: 0 },
    tone: [String],
    tonePercent: [Number],
    sources: [String],
    confidence: {type: Number, default: 10 },
    reference: String,
  },
  sentence: [{
    content: String,  
    cs: {type: Number, default: 0 },
    denominator: {type: Number, default: 0 },
    totalCS: {type: Number, default: 0 },
    totalComments: {type: Number, default: 0 }, 
    importance: {type: Number, default: 0 },
    totalImportance: {type: Number, default: 0 },
    tone: [{
      toneName: String,
      tonePercent: {type: Number, default: 0 }
    }], 
    confidence: {type: Number, default: 10 },
    reference: [{
      url: String,
      sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    }], 
    format: String,
    senId: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  }],
  context: {
    content: String,
    denominator: {type: Number, default: 0 },
    totalCS: {type: Number, default: 0 },
    totalImportance: {type: Number, default: 0 },
    cs: {type: Number, default: 0 },
    importance: {type: Number, default: 0 },
    sources: [String],
    confidence: {type: Number, default: 10 },
    reference: String,
  },
  media: [{
    content: String,
    media: String,
    cs: {type: Number, default: 0 },
    importance: {type: Number, default: 0 },
    sources: [String],
    confidence: {type: Number, default: 10 },
    reference: String,
  }],
  totalCS: {type: Number, default: 0 },
  totalPS: {type: Number, default: 0 },
  totalScore: {type: Number, default: 0 },
  influence: [{
    infName: String,
    denominator: {type: Number, default: 0 },
    infId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    totalPercent: {type: Number, default: 0 },
    infPercent: {type: Number, default: 0 }
  }],
  category: [{
    catName: String,
    denominator: {type: Number, default: 0 },
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    catPS: {type: Number, default: 0 },
    totalPS: {type: Number, default: 0 },
    catPercent: {type: Number, default: 0 }
  }],
  location: [{
    name: String,
    geolocation: String,
    percent: {type: Number, default: 0 }
  }],
  timeStamp: Date,
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Comments' 
  }],
  ranges: [{
    start: String,
    end: String,
    user: String,
    sentences: [{senId: String}]
  }]
}, {collection: 'posts'});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;