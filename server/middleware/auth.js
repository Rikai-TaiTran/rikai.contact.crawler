const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  console.log('Token received:', token); // Debugging line

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => { // Split to get the token part
    if (err) {
      console.log('Token verification error:', err); // Log the error
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = auth;