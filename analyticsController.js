const Post = require('../models/Post');
const User = require('../models/User');
const Message = require('../models/Message');

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalMessages = await Message.countDocuments();

    // Posts per day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const postsPerDay = await Post.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // User engagement (likes and comments)
    const engagementData = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: '$likes' } },
          totalComments: { $sum: { $size: '$comments' } }
        }
      }
    ]);

    // Top users by followers
    const topUsers = await User.find().sort({ followers: -1 }).limit(5).select('username followers');

    res.json({
      totalUsers,
      totalPosts,
      totalMessages,
      postsPerDay,
      engagement: engagementData[0] || { totalLikes: 0, totalComments: 0 },
      topUsers
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
