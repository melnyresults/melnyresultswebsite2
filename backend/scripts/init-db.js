const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/init');
require('dotenv').config();

async function createAdminUser() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === 'admin123') {
    console.warn('⚠️  WARNING: Using default admin password. Please change it in production!');
  }

  const db = getDatabase();
  
  try {
    // Check if admin user already exists
    db.get(
      `SELECT id FROM admin_users WHERE username = ?`,
      [username],
      async (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return;
        }

        if (row) {
          console.log('✅ Admin user already exists');
          db.close();
          return;
        }

        // Create admin user
        const passwordHash = await bcrypt.hash(password, 10);
        
        db.run(
          `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)`,
          [username, passwordHash],
          function(err) {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('✅ Admin user created successfully');
              console.log(`👤 Username: ${username}`);
              console.log(`🔑 Password: ${password}`);
            }
            db.close();
          }
        );
      }
    );
  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}

// Initialize database and create admin user
const { initDatabase } = require('../database/init');
initDatabase();

setTimeout(() => {
  createAdminUser();
}, 1000);