const Notification = require('../models/Notification');
const { redisClient } = require('../server');

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification.user.toString() === req.user.id) {
      notification.read = true;
      await notification.save();
      res.json({ msg: 'Notification marked as read' });
    } else {
      res.status(403).json({ msg: 'Not authorized' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification.user.toString() === req.user.id) {
      await notification.remove();
      res.json({ msg: 'Notification deleted' });
    } else {
      res.status(403).json({ msg: 'Not authorized' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create notification (helper function)
exports.createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type
    });
    await notification.save();

    // Store in Redis if available
    if (redisClient) {
      await redisClient.set(`notification:${userId}`, JSON.stringify({ message, type, createdAt: notification.createdAt }));
    }

    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};
