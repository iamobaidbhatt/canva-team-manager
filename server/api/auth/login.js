const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/init');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-demo';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const db = getDb();
  
  return new Promise((resolve) => {
    db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
      if (err) {
        return resolve(res.status(500).json({ error: 'Database error' }));
      }

      if (!admin) {
        return resolve(res.status(401).json({ error: 'Invalid credentials' }));
      }

      bcrypt.compare(password, admin.password_hash, (err, isValid) => {
        if (err || !isValid) {
          return resolve(res.status(401).json({ error: 'Invalid credentials' }));
        }

        const token = jwt.sign(
          { adminId: admin.id, username: admin.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        resolve(res.json({
          token,
          admin: {
            id: admin.id,
            username: admin.username
          }
        }));
      });
    });
  });
};
