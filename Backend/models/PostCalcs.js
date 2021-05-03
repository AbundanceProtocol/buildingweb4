const mongoose = require('mongoose');

const PostCalcsSchema = new mongoose.Schema({
  post: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  CS: {
    value: {type: Number, default: 0 },
    totalUserScores: {type: Number, default: 0 },
    totalUserCSRating: {type: Number, default: 0 },
    UserScoreLog: [{
      user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      userCurrentCS: {type: Number, default: 0 },
      userCurrentPS: {type: Number, default: 0 },
      userCSRating: {type: Number, default: 0 }
    }],
    sentenceCS: [{
      value: {type: Number, default: 0 },
      totalUserScores: {type: Number, default: 0 },
      totalUserCSRating: {type: Number, default: 0 },
      totaluserImportanceRating: {type: Number, default: 0 },
      UserScoreLog: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        userCurrentCS: {type: Number, default: 0 },
        userCurrentPS: {type: Number, default: 0 },
        userCSRating: {type: Number, default: 0 }
      }]
    }]
  }
}, {collection: 'postcalcs'});

const PostCalcs = mongoose.model('PostCalcs', PostCalcsSchema);

module.exports = PostCalcs;