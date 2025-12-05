/*
  # Simplify Blog Posts Insert Policy

  1. Changes
    - Drop the current insert policy
    - Create a policy that allows authenticated role without additional checks
    - The authenticated role is automatically set by Supabase when a valid JWT is present
  
  2. Security
    - Relies on Supabase's built-in role system
    - Only authenticated users can insert
    - Anon role (public) cannot insert
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON blog_posts;

-- Create simple policy for authenticated role
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also ensure the table grants are correct
GRANT INSERT ON blog_posts TO authenticated;
