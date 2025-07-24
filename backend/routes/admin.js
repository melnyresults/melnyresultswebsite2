const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const router = express.Router();

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Admin login
router.post('/login', [
  body('username').isLength({ min: 1 }).trim(),
  body('password').isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDatabase();

  db.get(
    `SELECT id, username, password_hash FROM admin_users WHERE username = ?`,
    [username],
    async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }

      if (!row || !await bcrypt.compare(password, row.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: row.id, username: row.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        admin: { id: row.id, username: row.username }
      });
    }
  );

  db.close();
});

// Get all comments (pending and approved)
router.get('/comments', verifyAdmin, (req, res) => {
  const status = req.query.status || 'all';
  const db = getDatabase();

  let query = `SELECT * FROM comments`;
  let params = [];

  if (status !== 'all') {
    query += ` WHERE status = ?`;
    params.push(status);
  }

  query += ` ORDER BY created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    res.json({
      success: true,
      comments: rows
    });
  });

  db.close();
});

// Approve a comment
router.put('/comments/:id/approve', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  db.run(
    `UPDATE comments SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to approve comment' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json({
        success: true,
        message: 'Comment approved successfully'
      });
    }
  );

  db.close();
});

// Delete a comment
router.delete('/comments/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  db.run(
    `DELETE FROM comments WHERE id = ?`,
    [id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete comment' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    }
  );

  db.close();
});

// Get analytics/stats
router.get('/stats', verifyAdmin, (req, res) => {
  const db = getDatabase();

  db.serialize(() => {
    let stats = {};

    // Get comment stats
    db.get(
      `SELECT 
        COUNT(*) as total_comments,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_comments,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_comments
       FROM comments`,
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to fetch stats' });
        }
        stats.comments = row;

        // Get like stats
        db.get(
          `SELECT 
            COUNT(*) as total_likes,
            SUM(count) as total_like_count
           FROM like_counts`,
          (err, row) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to fetch stats' });
            }
            stats.likes = row;

            res.json({
              success: true,
              stats
            });
          }
        );
      }
    );
  });

  db.close();
});

module.exports = router;