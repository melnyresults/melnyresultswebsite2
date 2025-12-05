/*
  # Fix Blog Posts Insert Policy for Authenticated Users

  1. Changes
    - Drop the overly restrictive insert policy
    - Create a new policy that properly allows authenticated users to insert posts
    - The issue was that auth.uid() was returning null even for authenticated users
    - New policy uses the authenticated role which is properly set by Supabase
  
  2. Security
    - Still maintains RLS protection
    - Only authenticated users (logged in) can create posts
    - Anonymous users cannot create posts
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;

-- Create a new policy that works with authenticated role
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
