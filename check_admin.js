const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server/database/canva_teams.db');
const db = new sqlite3.Database(dbPath);

db.get("SELECT username FROM admins WHERE id = 1", (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else if (row) {
    console.log('Current admin username:', row.username);
  } else {
    console.log('No admin found');
  }
  db.close();
});

