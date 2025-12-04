-- Account linking table for bank accounts and payment methods
CREATE TABLE IF NOT EXISTS linked_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Account details
  account_type VARCHAR(30) NOT NULL, -- bank_account, debit_card, credit_card
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  
  -- Bank information
  bank_name VARCHAR(100),
  bank_code VARCHAR(20),
  iban VARCHAR(34),
  swift_code VARCHAR(11),
  
  -- Card information (if applicable)
  card_last_four VARCHAR(4),
  card_expiry_month INTEGER,
  card_expiry_year INTEGER,
  card_brand VARCHAR(20), -- visa, mastercard, etc.
  
  -- Status and verification
  is_verified BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
  
  -- Security
  encrypted_data TEXT, -- Store sensitive data encrypted
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_id ON linked_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_type ON linked_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_status ON linked_accounts(status);

-- Ensure only one primary account per user per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_linked_accounts_user_primary 
  ON linked_accounts(user_id, account_type) 
  WHERE is_primary = true;

-- Update trigger
CREATE TRIGGER update_linked_accounts_updated_at
  BEFORE UPDATE ON linked_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- OTP verification table for account linking
CREATE TABLE IF NOT EXISTS account_verification_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  linked_account_id UUID NOT NULL REFERENCES linked_accounts(id) ON DELETE CASCADE,
  otp_code VARCHAR(6) NOT NULL,
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verification_otps_account ON account_verification_otps(linked_account_id);
CREATE INDEX IF NOT EXISTS idx_verification_otps_expires ON account_verification_otps(expires_at);

-- Comments
COMMENT ON TABLE linked_accounts IS 'Stores linked bank accounts and payment methods';
COMMENT ON COLUMN linked_accounts.encrypted_data IS 'Encrypted sensitive account information';
COMMENT ON TABLE account_verification_otps IS 'OTPs for verifying linked accounts';
