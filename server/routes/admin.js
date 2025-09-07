const express = require('express');
const bcrypt = require('bcrypt');
const { verifyAdmin } = require('./auth');
const { getDb } = require('../database/db');

const router = express.Router();

// Get all teams (admin only)
router.get('/teams', verifyAdmin, (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT t.*, 
           COUNT(u.id) as actual_joins
    FROM teams t
    LEFT JOIN users u ON t.id = u.team_id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `, (err, teams) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(teams);
  });
});

// Create new team
router.post('/teams', verifyAdmin, (req, res) => {
  const { name, description, invite_link, max_members } = req.body;

  if (!name || !invite_link) {
    return res.status(400).json({ error: 'Name and invite link are required' });
  }

  const db = getDb();
  
  db.run(
    `INSERT INTO teams (name, description, invite_link, max_members) 
     VALUES (?, ?, ?, ?)`,
    [name, description || '', invite_link, max_members || 50],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        success: true,
        teamId: this.lastID,
        message: 'Team created successfully'
      });
    }
  );
});

// Update team
router.put('/teams/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, invite_link, max_members, is_active } = req.body;

  const db = getDb();
  
  db.run(
    `UPDATE teams 
     SET name = ?, description = ?, invite_link = ?, max_members = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, description, invite_link, max_members, is_active ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json({
        success: true,
        message: 'Team updated successfully'
      });
    }
  );
});

// Delete team
router.delete('/teams/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;

  const db = getDb();
  
  // First delete associated users
  db.run("DELETE FROM users WHERE team_id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Then delete the team
    db.run("DELETE FROM teams WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json({
        success: true,
        message: 'Team deleted successfully'
      });
    });
  });
});

// Get team stats
router.get('/stats', verifyAdmin, (req, res) => {
  const db = getDb();
  
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
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(stats);
  });
});

// Get recent joins
router.get('/recent-joins', verifyAdmin, (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT u.*, t.name as team_name
    FROM users u
    JOIN teams t ON u.team_id = t.id
    ORDER BY u.joined_at DESC
    LIMIT 50
  `, (err, joins) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(joins);
  });
});

// Update admin settings (username/password)
router.put('/settings', verifyAdmin, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required' });
  }

  const db = getDb();
  
  try {
    // Get current admin credentials
    db.get("SELECT username, password_hash FROM admins WHERE id = 1", async (err, admin) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Prepare update data
      let updateFields = [];
      let updateValues = [];

      if (newUsername && newUsername.trim() !== '') {
        updateFields.push('username = ?');
        updateValues.push(newUsername.trim());
      }

      if (newPassword && newPassword.trim() !== '') {
        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateFields.push('password_hash = ?');
        updateValues.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No changes to update' });
      }

      updateValues.push(1); // admin id

      const updateQuery = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`;

      db.run(updateQuery, updateValues, function(err) {
        if (err) {
          console.error('Update error:', err);
          return res.status(500).json({ error: 'Update failed: ' + err.message });
        }

        res.json({
          success: true,
          message: 'Settings updated successfully'
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Check current admin username (for debugging)
router.get('/current-admin', (req, res) => {
  const db = getDb();
  db.get("SELECT username FROM admins WHERE id = 1", (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ username: admin.username });
  });
});

// Reset admin password to default (for debugging)
router.post('/reset-password', (req, res) => {
  const db = getDb();
  const defaultPassword = 'admin123';
  
  bcrypt.hash(defaultPassword, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    db.run("UPDATE admins SET password_hash = ? WHERE id = 1", [hash], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        success: true,
        message: 'Password reset to default',
        username: 'admin',
        password: 'admin123'
      });
    });
  });
});

module.exports = router;
