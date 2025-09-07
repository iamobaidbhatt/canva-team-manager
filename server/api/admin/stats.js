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
    db.get(`
      SELECT 
        COUNT(DISTINCT t.id) as total_teams,
        COUNT(DISTINCT CASE WHEN t.is_active = 1 THEN t.id END) as active_teams,
        COUNT(u.id) as total_joins,
        COUNT(DISTINCT u.email) as unique_users
      FROM teams t
      LEFT JOIN users u ON t.id = u.team_id
    `, (err, stats) => {
      if (err) {
        return resolve(res.status(500).json({ error: 'Database error' }));
      }
      resolve(res.json(stats));
    });
  });
};
