const { getDb } = require('../../database/init');
const { verifyAdmin } = require('../../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verify admin authentication
  const authResult = verifyAdmin(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { id } = req.query;
  const db = getDb();

  if (req.method === 'PUT') {
    // Update team
    const { name, description, invite_link, max_members, is_active } = req.body;

    return new Promise((resolve) => {
      db.run(
        `UPDATE teams 
         SET name = ?, description = ?, invite_link = ?, max_members = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, description, invite_link, max_members, is_active ? 1 : 0, id],
        function(err) {
          if (err) {
            return resolve(res.status(500).json({ error: 'Database error' }));
          }
          
          if (this.changes === 0) {
            return resolve(res.status(404).json({ error: 'Team not found' }));
          }
          
          resolve(res.json({
            success: true,
            message: 'Team updated successfully'
          }));
        }
      );
    });
  }

  if (req.method === 'DELETE') {
    // Delete team
    return new Promise((resolve) => {
      // First delete associated users
      db.run("DELETE FROM users WHERE team_id = ?", [id], (err) => {
        if (err) {
          return resolve(res.status(500).json({ error: 'Database error' }));
        }
        
        // Then delete the team
        db.run("DELETE FROM teams WHERE id = ?", [id], function(err) {
          if (err) {
            return resolve(res.status(500).json({ error: 'Database error' }));
          }
          
          if (this.changes === 0) {
            return resolve(res.status(404).json({ error: 'Team not found' }));
          }
          
          resolve(res.json({
            success: true,
            message: 'Team deleted successfully'
          }));
        });
      });
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
