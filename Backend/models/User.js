const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: {type: String, required: true },
  date: {type: Date, default: Date.now },
  denominator: {type: Number, default: 0 },
  totalCS: {type: Number, default: 0 }, 
  CS: {type: Number, default: 0 },
  PS: {type: Number, default: 0 },
  post: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  score: {type: Number, default: 0 },
  category: [{
    catName: {type: String },
    catId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    denominator: {type: Number, default: 0 },
    catTotalCS: {type: Number, default: 0 },
    catCS: {type: Number, default: 0 },
    catPS: {type: Number, default: 0 },
    catScore: {type: Number, default: 0 },
    catPosts: [{
      postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
      comment: {type: Boolean, default: true},
      commentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
      denominatorCS: {type: Number, default: 0 },
      denominatorPS: {type: Number, default: 0 },
      postTotalCS: {type: Number, default: 0 },
      postTotalPS: {type: Number, default: 0 },
      postCS: {type: Number, default: 0 },
      postPS: {type: Number, default: 0 },
      postOldCS: {type: Number, default: 0 },
      postOldPS: {type: Number, default: 0 },
      postScore: {type: Number, default: 0 }
    }]
  }],
  preferences: [{
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    order: [String]
  }],
  firstName: String,
  lastName: String,
  middleName: String,
  bio: String,
  creditCard: String
}, {collection: 'users'});

UserSchema.pre('save', async function(next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(this.password, salt);
    this.password = passHash;
    next();
  } catch(error) {
    console.log('error 2')
    next(error);
  }
})

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    console.log('error')
    throw new Error(error);
  }
}

const User = mongoose.model('User', UserSchema);

module.exports = User;