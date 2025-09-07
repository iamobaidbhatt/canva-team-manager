const express = require('express');
const rateLimit = require('express-rate-limit');
const { getDb } = require('../database/db');

const router = express.Router();

// Rate limiting for join requests
const joinLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 join requests per windowMs
  message: { error: 'Too many join attempts. Please try again later.' }
});

// Get available teams
router.get('/', (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT id, name, description, max_members, current_members, is_active
    FROM teams 
    WHERE is_active = 1 AND current_members < max_members
    ORDER BY created_at DESC
  `, (err, teams) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(teams);
  });
});

// Join a team
router.post('/:teamId/join', joinLimit, (req, res) => {
  const { teamId } = req.params;
  const { email } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  const db = getDb();

  // First, get team details and invite link
  db.get(`
    SELECT * FROM teams 
    WHERE id = ? AND is_active = 1 AND current_members < max_members
  `, [teamId], (err, team) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!team) {
      return res.status(404).json({ error: 'Team not found or full' });
    }

    // Check if user already joined this team (by email or IP)
    if (email) {
      db.get("SELECT * FROM users WHERE email = ? AND team_id = ?", [email, teamId], (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingUser) {
          return res.status(400).json({ error: 'You have already joined this team' });
        }

        // Record the join attempt
        db.run(
          "INSERT INTO users (email, team_id, ip_address) VALUES (?, ?, ?)",
          [email, teamId, ipAddress],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
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

            res.json({
              success: true,
              message: 'Successfully joined the team!',
              inviteLink: team.invite_link,
              teamName: team.name
            });
          }
        );
      });
    } else {
      // If no email provided, just return the invite link
      res.json({
        success: true,
        message: 'Click the link below to join the team!',
        inviteLink: team.invite_link,
        teamName: team.name
      });
    }
  });
});

module.exports = router;
