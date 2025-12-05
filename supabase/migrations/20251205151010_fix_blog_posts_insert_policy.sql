/*
  # Fix Blog Posts Insert Policy
  
  1. Changes
    - Drop and recreate the INSERT policy for blog_posts with proper authentication check
    - Ensure authenticated users can create posts without restrictions
  
  2. Security
    - Policy explicitly checks for authenticated role
    - No additional restrictions on insert
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;

-- Create a more explicit INSERT policy
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
