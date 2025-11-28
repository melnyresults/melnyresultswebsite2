/*
  # Fix Blog Visibility and RLS Policies

  ## Problem
  - Conflicting RLS policies causing inconsistent blog post visibility
  - "Enable read access for all users" policy is too permissive
  - Blog posts not visible to public users after clearing cookies

  ## Solution
  1. Drop the overly permissive "Enable read access for all users" policy
  2. Keep only the specific policy that enforces published + scheduled logic
  3. Ensure consistent behavior for authenticated and public users

  ## Changes
  - Drop: "Enable read access for all users" policy
  - Keep: "Anyone can view published and scheduled posts" policy
  - Keep: "Authenticated users can view all posts" policy for admin access

  ## Result
  - Public users see only published posts with valid schedule dates
  - Authenticated users (admins) see all posts for management
  - Behavior is consistent regardless of authentication state
*/

-- Drop the conflicting overly permissive policy
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;

-- Verify that the correct policies remain:
-- 1. "Anyone can view published and scheduled posts" - for public access
-- 2. "Authenticated users can view all posts" - for admin access

-- The following policies should still be active:
-- - Anyone can view published and scheduled posts (public role)
-- - Authenticated users can view all posts (authenticated role)
-- - Authenticated users can create posts (authenticated role)
-- - Authenticated users can update posts (authenticated role)
-- - Authenticated users can delete posts (authenticated role)
