const express = require('express');
const { getPosts, createPost, likePost, commentPost, followUser } = require('../controllers/postController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', auth, createPost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentPost);
router.post('/follow/:id', auth, followUser);

module.exports = router;
