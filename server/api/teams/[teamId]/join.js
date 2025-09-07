const { getDb } = require('../../database/init');

// Simple rate limiting using a Map (in production, use Redis or similar)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

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

  const { teamId } = req.query;
  const { email } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';

  // Check rate limit
  if (!checkRateLimit(ipAddress)) {
    return res.status(429).json({ error: 'Too many join attempts. Please try again later.' });
  }

  const db = getDb();

  return new Promise((resolve) => {
    // First, get team details and invite link
    db.get(`
      SELECT * FROM teams 
      WHERE id = ? AND is_active = 1 AND current_members < max_members
    `, [teamId], (err, team) => {
      if (err) {
        return resolve(res.status(500).json({ error: 'Database error' }));
      }

      if (!team) {
        return resolve(res.status(404).json({ error: 'Team not found or full' }));
      }

      // Check if user already joined this team (by email or IP)
      if (email) {
        db.get("SELECT * FROM users WHERE email = ? AND team_id = ?", [email, teamId], (err, existingUser) => {
          if (err) {
            return resolve(res.status(500).json({ error: 'Database error' }));
          }

          if (existingUser) {
            return resolve(res.status(400).json({ error: 'You have already joined this team' }));
          }

          // Record the join attempt
          db.run(
            "INSERT INTO users (email, team_id, ip_address) VALUES (?, ?, ?)",
            [email, teamId, ipAddress],
            function(err) {
              if (err) {
                return resolve(res.status(500).json({ error: 'Database error' }));
              }

              // Update team member count
              db.run(
                "UPDATE teams SET current_members = current_members + 1 WHERE id = ?",
                [teamId],
                (err) => {
                  if (err) {
                    console.error('Error updating member count:', err);
                  }
                }
              );

              resolve(res.json({
                success: true,
                message: 'Successfully joined the team!',
                inviteLink: team.invite_link,
                teamName: team.name
              }));
            }
          );
        });
      } else {
        // If no email provided, just return the invite link
        resolve(res.json({
          success: true,
          message: 'Click the link below to join the team!',
          inviteLink: team.invite_link,
          teamName: team.name
        }));
      }
    });
  });
};
