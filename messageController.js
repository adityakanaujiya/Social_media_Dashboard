const Message = require('../models/Message');
const User = require('../models/User');

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).populate('sender', 'username').populate('receiver', 'username').sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiver, text } = req.body;
  try {
    const message = new Message({ sender: req.user.id, receiver, text });
    await message.save();
    await message.populate('sender', 'username');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', req.user._id] },
              then: '$receiver',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: { username: 1, profilePic: 1 },
          lastMessage: 1
        }
      }
    ]);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
