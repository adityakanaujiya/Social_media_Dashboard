     const User = require('../models/User');
     const bcrypt = require('bcryptjs');
     const jwt = require('jsonwebtoken');

     exports.register = async (req, res) => {
       const { username, email, password } = req.body;
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = new User({ username, email, password: hashedPassword });
       await user.save();
       res.status(201).json({ msg: 'User registered' });
     };

     exports.login = async (req, res) => {
       const { email, password } = req.body;
       const user = await User.findOne({ email });
       if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ msg: 'Invalid credentials' });
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
       res.json({ token, user });
     };
     