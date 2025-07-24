const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/blog.db';

function initDatabase() {
  // Ensure database directory exists
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      return;
    }
    console.log('📁 Connected to SQLite database');
  });

  // Create tables
  db.serialize(() => {
    // Comments table
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_slug TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        content TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Likes table
    db.run(`
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_slug TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_slug, ip_address)
      )
    `);

    // Like counts table (for performance)
    db.run(`
      CREATE TABLE IF NOT EXISTS like_counts (
        post_slug TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin users table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_likes_post_slug ON likes(post_slug)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_likes_ip ON likes(ip_address)`);
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database initialized successfully');
    }
  });
}

function getDatabase() {
  return new sqlite3.Database(DB_PATH);
}

module.exports = {
  initDatabase,
  getDatabase
};