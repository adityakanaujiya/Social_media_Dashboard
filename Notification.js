     const mongoose = require('mongoose');
     const notificationSchema = new mongoose.Schema({
       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       message: String,
       type: String, // e.g., 'like', 'follow'
       read: { type: Boolean, default: false },
     }, { timestamps: true });
     module.exports = mongoose.model('Notification', notificationSchema);
     