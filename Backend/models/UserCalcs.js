const mongoose = require('mongoose');

const UserCalcsSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
  }],
  CS: {
    value: Number,
    },
  PS: {
    value: Number,
  }

}, {collection: 'usercalcs'});

const UserCalcs = mongoose.model('UserCalcs', UserCalcsSchema);

module.exports = UserCalcs;