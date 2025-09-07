const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'server/database/canva_teams.db');
const db = new sqlite3.Database(dbPath);

// Reset to default admin credentials
const defaultPassword = 'admin123';
bcrypt.hash(defaultPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  db.run("UPDATE admins SET username = ?, password_hash = ? WHERE id = 1", 
    ['admin', hash], (err) => {
    if (err) {
      console.error('Error updating admin:', err);
    } else {
      console.log('✅ Admin credentials reset to:');
      console.log('Username: admin');
      console.log('Password: admin123');
    }
    db.close();
  });
});

