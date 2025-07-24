const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { getDatabase } = require('../database/init');
const router = express.Router();

// Get comments for a blog post
router.get('/:slug', [
  param('slug').isLength({ min: 1 }).trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { slug } = req.params;
  const db = getDatabase();

  db.all(
    `SELECT id, author_name, content, created_at 
     FROM comments 
     WHERE post_slug = ? AND status = 'approved' 
     ORDER BY created_at DESC`,
    [slug],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }

      res.json({
        success: true,
        comments: rows.map(row => ({
          id: row.id,
          author: row.author_name,
          content: row.content,
          createdAt: row.created_at
        }))
      });
    }
  );

  db.close();
});

// Post a new comment
router.post('/:slug', [
  param('slug').isLength({ min: 1 }).trim().escape(),
  body('author_name').isLength({ min: 1, max: 100 }).trim().escape(),
  body('author_email').isEmail().normalizeEmail(),
  body('content').isLength({ min: 1, max: 1000 }).trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { slug } = req.params;
  const { author_name, author_email, content } = req.body;
  const ip_address = req.ip || req.connection.remoteAddress;
  const user_agent = req.get('User-Agent');

  const db = getDatabase();

  db.run(
    `INSERT INTO comments (post_slug, author_name, author_email, content, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [slug, author_name, author_email, content, ip_address, user_agent],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save comment' });
      }

      res.json({
        success: true,
        message: 'Comment submitted successfully and is pending approval',
        commentId: this.lastID
      });
    }
  );

  db.close();
});

module.exports = router;