-- Add username and password columns to users table
-- This migration adds support for username/password authentication

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Comments for documentation
COMMENT ON COLUMN users.username IS 'Unique username for login (can be set by user or auto-generated)';
COMMENT ON COLUMN users.password IS 'SHA-256 hashed password for authentication';
