const express = require('express');
const { param } = require('express-validator');
const { getDatabase } = require('../database/init');
const router = express.Router();

// Get like count for a blog post
router.get('/:slug', [
  param('slug').isLength({ min: 1 }).trim().escape()
], (req, res) => {
  const { slug } = req.params;
  const db = getDatabase();

  db.get(
    `SELECT count FROM like_counts WHERE post_slug = ?`,
    [slug],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch like count' });
      }

      res.json({
        success: true,
        slug: slug,
        likes: row ? row.count : 0
      });
    }
  );

  db.close();
});

// Like a blog post
router.post('/:slug/like', [
  param('slug').isLength({ min: 1 }).trim().escape()
], (req, res) => {
  const { slug } = req.params;
  const ip_address = req.ip || req.connection.remoteAddress;
  const user_agent = req.get('User-Agent');

  const db = getDatabase();

  // Start transaction
  db.serialize(() => {
    // Check if user already liked this post
    db.get(
      `SELECT id FROM likes WHERE post_slug = ? AND ip_address = ?`,
      [slug, ip_address],
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to process like' });
        }

        if (row) {
          return res.status(400).json({ 
            success: false, 
            error: 'You have already liked this post' 
          });
        }

        // Add like
        db.run(
          `INSERT INTO likes (post_slug, ip_address, user_agent) VALUES (?, ?, ?)`,
          [slug, ip_address, user_agent],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to add like' });
            }

            // Update like count
            db.run(
              `INSERT OR REPLACE INTO like_counts (post_slug, count, updated_at)
               VALUES (?, 
                 COALESCE((SELECT count FROM like_counts WHERE post_slug = ?), 0) + 1,
                 CURRENT_TIMESTAMP)`,
              [slug, slug],
              function(err) {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Failed to update like count' });
                }

                // Get updated count
                db.get(
                  `SELECT count FROM like_counts WHERE post_slug = ?`,
                  [slug],
                  (err, row) => {
                    if (err) {
                      console.error('Database error:', err);
                      return res.status(500).json({ error: 'Failed to fetch updated count' });
                    }

                    res.json({
                      success: true,
                      message: 'Post liked successfully',
                      likes: row ? row.count : 1
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });

  db.close();
});

module.exports = router;