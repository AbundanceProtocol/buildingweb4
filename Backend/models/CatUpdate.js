const mongoose = require('mongoose');

const CatUpdateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: {type: Number, default: 0 },
  date: {type: Date, default: Date.now },
  updateCount: {type: Number, default: 0 },
  catUpdate: [{
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    percent: {type: Number, default: 0 },
    score: {type: Number, default: 0 },
    ratio: {type: Number, default: 0 },
    reason: String,
    sources: [String],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  }]
}, {collection: 'catupdates'});

const CatUpdate = mongoose.model('CatUpdate', CatUpdateSchema);

module.exports = CatUpdate;