const mongoose = require('mongoose');

const RatioSchema = new mongoose.Schema({
  categoryName: String,
  postCount: {type: Number, default: 0 },
  catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  catRatio: [{
    catName: String,
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    postCount: {type: Number, default: 0 },
    ratioCount: {type: Number, default: 0 },
    ratioTotals: {type: Number, default: 0 },
    ratio: {type: Number, default: 0 }
  }]
}, {collection: 'ratios'});

const Ratio = mongoose.model('Ratio', RatioSchema);

module.exports = Ratio;