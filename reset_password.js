const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'server/database/canva_teams.db');
const db = new sqlite3.Database(dbPath);

// Reset password to default
const defaultPassword = 'admin123';
bcrypt.hash(defaultPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  db.run("UPDATE admins SET password_hash = ? WHERE id = 1", [hash], (err) => {
    if (err) {
      console.error('Error updating password:', err);
    } else {
      console.log('✅ Password reset successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
    }
    db.close();
  });
});

