const { getDb } = require('../database/init');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get available teams
    const db = getDb();
    
    return new Promise((resolve) => {
      db.all(`
        SELECT id, name, description, max_members, current_members, is_active
        FROM teams 
        WHERE is_active = 1 AND current_members < max_members
        ORDER BY created_at DESC
      `, (err, teams) => {
        if (err) {
          return resolve(res.status(500).json({ error: 'Database error' }));
        }
        resolve(res.json(teams));
      });
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
