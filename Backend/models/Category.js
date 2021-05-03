const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: String,
  catRatio: {type: Number, default: 0 },
  catParentRatio: {type: Number, default: 0 },
  selfParentRatio: {type: Number, default: 0 },
  denominator: {type: Number, default: 0 },
  catRatioTotal: {type: Number, default: 0 },
  catUpdate: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: {type: Number, default: 0 }, // user score                        
    percent: {type: Number, default: 0 },
    ratio: {type: Number, default: 0 },
    reason: String,
    sources: [String],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  }],
  totalRank: {type: Number, default: 0 },
  postCount: {type: Number, default: 0 },
  share: {
    value: {type: Number, default: 0 },
    input: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: {type: Number, default: 0 },
      share: {type: Number, default: 0 }
    }]
  },
  parent: {
    userTotalScore: {type: Number, default: 0 },
    categories: [{ 
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      name: String,
      userScore: {type: Number, default: 0 },
    }]
  },
  child: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Category' 
  }],
  categoryRelation: [{
    ratio: {type: Number, default: 0 },
    ratioProgress: [Number],
    counter: {type: Number, default: 0 },
    counterProgress: [Number],
    total: {type: Number, default: 0 },
    totalProgress: [Number]
  }]
}, {collection: 'categories'});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;