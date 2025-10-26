// models/Post.js
const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  userId: String,
  text: String,
  mediaUrl: String,
  likes: [String],
  comments: [{
    userId: String,
    comment: String,
  }],
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);
