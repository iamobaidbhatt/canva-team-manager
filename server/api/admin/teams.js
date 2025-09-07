const { getDb } = require('../database/init');
const { verifyAdmin } = require('../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verify admin authentication for all methods except OPTIONS
  const authResult = verifyAdmin(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const db = getDb();

  if (req.method === 'GET') {
    // Get all teams
    return new Promise((resolve) => {
      db.all(`
        SELECT t.*, 
               COUNT(u.id) as actual_joins
        FROM teams t
        LEFT JOIN users u ON t.id = u.team_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `, (err, teams) => {
        if (err) {
          return resolve(res.status(500).json({ error: 'Database error' }));
        }
        resolve(res.json(teams));
      });
    });
  }

  if (req.method === 'POST') {
    // Create new team
    const { name, description, invite_link, max_members } = req.body;

    if (!name || !invite_link) {
      return res.status(400).json({ error: 'Name and invite link are required' });
    }

    return new Promise((resolve) => {
      db.run(
        `INSERT INTO teams (name, description, invite_link, max_members) 
         VALUES (?, ?, ?, ?)`,
        [name, description || '', invite_link, max_members || 50],
        function(err) {
          if (err) {
            return resolve(res.status(500).json({ error: 'Database error' }));
          }
          
          resolve(res.json({
            success: true,
            teamId: this.lastID,
            message: 'Team created successfully'
          }));
        }
      );
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
