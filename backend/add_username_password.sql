-- Quick fix: Add username and password columns to users table
-- Run this SQL in your PostgreSQL database (pgAdmin, psql, or Supabase SQL editor)

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('username', 'password');
