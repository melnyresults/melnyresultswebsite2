/*
  # Fix Blog Posts Insert Policy with Proper Auth Check

  1. Changes
    - Drop the current insert policy
    - Create a new policy that checks for valid JWT token
    - This approach is more reliable than checking auth.uid()
  
  2. Security
    - Only users with valid JWT tokens (authenticated) can insert
    - Anonymous users are blocked
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;

-- Create new policy that checks for JWT
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() IS NOT NULL
  );
