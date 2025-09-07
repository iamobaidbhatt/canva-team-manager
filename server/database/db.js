const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'canva_teams.db');

let db;

function initializeDatabase() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('📦 Connected to SQLite database');
      createTables();
    }
  });
}

function createTables() {
  // Teams table to store Canva Pro team links
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      invite_link TEXT NOT NULL,
      max_members INTEGER DEFAULT 50,
      current_members INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table to track who joined which team
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      team_id INTEGER,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      FOREIGN KEY (team_id) REFERENCES teams (id)
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add updated_at column if it doesn't exist (migration)
  db.run(`
    ALTER TABLE admins ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  `, (err) => {
    // Ignore error if column already exists
  });

  // Insert default admin if none exists
  db.get("SELECT COUNT(*) as count FROM admins", (err, row) => {
    if (!err && row.count === 0) {
      const bcrypt = require('bcrypt');
      const defaultPassword = 'admin123'; // Change this!
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (!err) {
          db.run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", 
            ['admin', hash], (err) => {
            if (!err) {
              console.log('🔑 Default admin created: username=admin, password=admin123');
              console.log('⚠️  Please change the default password after first login!');
            }
          });
        }
      });
    }
  });
}

function getDb() {
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};
