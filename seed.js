const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/database');

connectDB();
const seed = async () => {
  await User.create({ username: 'user1', email: 'user1@example.com', password: 'hashedpass' });
  await Post.create({ user: 'userId', content: 'Sample post', media: ['uploads/sample.jpg'] });
  console.log('Seeded');
  process.exit();
};
seed();