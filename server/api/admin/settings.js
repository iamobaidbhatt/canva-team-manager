const bcrypt = require('bcrypt');
const { getDb } = require('../database/init');
const { verifyAdmin } = require('../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin authentication
  const authResult = verifyAdmin(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required' });
  }

  const db = getDb();

  return new Promise((resolve) => {
    // Get current admin credentials
    db.get("SELECT username, password_hash FROM admins WHERE id = 1", async (err, admin) => {
      if (err) {
        console.error('Database error:', err);
        return resolve(res.status(500).json({ error: 'Database error: ' + err.message }));
      }

      if (!admin) {
        return resolve(res.status(404).json({ error: 'Admin not found' }));
      }

      try {
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash);
        if (!isValidPassword) {
          return resolve(res.status(400).json({ error: 'Current password is incorrect' }));
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
            return resolve(res.status(400).json({ error: 'New password must be at least 6 characters' }));
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          updateFields.push('password_hash = ?');
          updateValues.push(hashedPassword);
        }

        if (updateFields.length === 0) {
          return resolve(res.status(400).json({ error: 'No changes to update' }));
        }

        updateValues.push(1); // admin id

        const updateQuery = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`;

        db.run(updateQuery, updateValues, function(err) {
          if (err) {
            console.error('Update error:', err);
            return resolve(res.status(500).json({ error: 'Update failed: ' + err.message }));
          }

          resolve(res.json({
            success: true,
            message: 'Settings updated successfully'
          }));
        });
      } catch (error) {
        console.error('Server error:', error);
        resolve(res.status(500).json({ error: 'Server error: ' + error.message }));
      }
    });
  });
};
