// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profileImage: String,
  followers: [String],
  following: [String],
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
