const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username profilePic').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { content, media } = req.body;
  try {
    const post = new Post({ user: req.user.id, content, media: media || [] });
    await post.save();
    await post.populate('user', 'username profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();

      // Create notification
      if (post.user.toString() !== req.user.id) {
        const { createNotification } = require('./notificationController');
        await createNotification(post.user, `${req.user.username} liked your post`, 'like');
      }
    }
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add comment to post
exports.commentPost = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user.id, text, date: new Date() });
    await post.save();

    // Create notification
    if (post.user.toString() !== req.user.id) {
      const { createNotification } = require('./notificationController');
      await createNotification(post.user, `${req.user.username} commented on your post`, 'comment');
    }

    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Follow user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!currentUser.following.includes(req.params.id)) {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
      await currentUser.save();
      await userToFollow.save();

      // Create notification
      const { createNotification } = require('./notificationController');
      await createNotification(req.params.id, `${currentUser.username} started following you`, 'follow');
    }
    res.json({ msg: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
