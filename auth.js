     const jwt = require('jsonwebtoken');
     const auth = (req, res, next) => {
       const token = req.header('Authorization')?.replace('Bearer ', '');
       if (!token) return res.status(401).json({ msg: 'No token' });
       try {
         req.user = jwt.verify(token, process.env.JWT_SECRET);
         next();
       } catch (err) {
         res.status(401).json({ msg: 'Invalid token' });
       }
     };
     module.exports = auth;
     