const { getDb } = require('../database/init');
const { verifyAdmin } = require('../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const authResult = verifyAdmin(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const db = getDb();

  return new Promise((resolve) => {
    db.all(`
      SELECT u.*, t.name as team_name
      FROM users u
      JOIN teams t ON u.team_id = t.id
      ORDER BY u.joined_at DESC
      LIMIT 50
    `, (err, joins) => {
      if (err) {
        return resolve(res.status(500).json({ error: 'Database error' }));
      }
      resolve(res.json(joins));
    });
  });
};
