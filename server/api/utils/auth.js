const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-demo';

function verifyAdmin(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return { error: 'Access denied. No token provided.', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { admin: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 400 };
  }
}

module.exports = { verifyAdmin };
