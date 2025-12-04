/*
  # Fix Pipelines User ID Constraint

  1. Changes
    - Make pipelines.user_id NOT NULL to ensure all pipelines have an owner
    - This is required for RLS policies to work correctly
    
  2. Security
    - Ensures every pipeline has an owner
    - Prevents orphaned pipelines
    - Makes RLS policies more reliable
*/

-- First, check if there are any NULL user_id values and delete them
DELETE FROM pipelines WHERE user_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE pipelines
  ALTER COLUMN user_id SET NOT NULL;
