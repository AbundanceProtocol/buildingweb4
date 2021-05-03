const mongoose = require('mongoose');

const CatTotalSchema = new mongoose.Schema({
  totalRatioCount: {type: Number, default: 0.000001 },
  totalScoreCount: {type: Number, default: 0 },
  denominator: {type: Number, default: 0 },
  updateLog: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    update: { type: mongoose.Schema.Types.ObjectId, ref: 'CatUpdate' },
  }]

}, {collection: 'cattotals'});

const CatTotal = mongoose.model('CatTotal', CatTotalSchema);

module.exports = CatTotal;