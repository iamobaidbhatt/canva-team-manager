const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// For Vercel, we'll use an in-memory database that gets recreated on each function call
// In production, you should use a persistent database like PostgreSQL, MySQL, or MongoDB
let db;

function initializeDatabase() {
  if (db) {
    return db;
  }

  // Use in-memory database for serverless
  db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('📦 Connected to in-memory SQLite database');
      createTables();
    }
  });

  return db;
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

  // Insert some sample teams for demonstration
  db.get("SELECT COUNT(*) as count FROM teams", (err, row) => {
    if (!err && row.count === 0) {
      const sampleTeams = [
        {
          name: 'Design Team Alpha',
          description: 'Professional design team for creative projects',
          invite_link: 'https://canva.com/team/join/alpha123',
          max_members: 25
        },
        {
          name: 'Marketing Squad',
          description: 'Marketing and branding specialists',
          invite_link: 'https://canva.com/team/join/marketing456',
          max_members: 30
        },
        {
          name: 'Content Creators',
          description: 'Content creation and social media team',
          invite_link: 'https://canva.com/team/join/content789',
          max_members: 20
        }
      ];

      sampleTeams.forEach(team => {
        db.run(
          "INSERT INTO teams (name, description, invite_link, max_members) VALUES (?, ?, ?, ?)",
          [team.name, team.description, team.invite_link, team.max_members]
        );
      });
    }
  });
}

function getDb() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDb
};
