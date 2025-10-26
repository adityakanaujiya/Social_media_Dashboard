const connectDB = require('./config/database');

connectDB().then(() => {
  console.log('DB connected successfully');
  process.exit(0);
}).catch(err => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});
