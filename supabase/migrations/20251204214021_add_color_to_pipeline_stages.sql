/*
  # Add color column to pipeline_stages

  1. Changes
    - Add color column to pipeline_stages table
    - This column stores the color code for each pipeline stage
    - Default to a blue color if none specified
    
  2. Details
    - Column type: text (to store hex color codes like #3B82F6)
    - Default value: #3B82F6 (blue)
    - Not nullable to ensure all stages have a color
*/

-- Add color column to pipeline_stages
ALTER TABLE pipeline_stages
  ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT '#3B82F6';
