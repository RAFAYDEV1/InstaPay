-- Wallets table to store user wallet information
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL CHECK (balance >= 0),
  currency VARCHAR(3) DEFAULT 'PKR' NOT NULL,
  wallet_type VARCHAR(20) DEFAULT 'personal' NOT NULL, -- personal, business
  status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, suspended, closed
  daily_limit DECIMAL(15, 2) DEFAULT 100000.00,
  monthly_limit DECIMAL(15, 2) DEFAULT 1000000.00,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status);

-- Ensure each user has only one primary wallet per currency
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallets_user_primary 
  ON wallets(user_id, currency) 
  WHERE is_primary = true;

-- Update trigger
CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Wallet balance history for audit trail
CREATE TABLE IF NOT EXISTS wallet_balance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  old_balance DECIMAL(15, 2) NOT NULL,
  new_balance DECIMAL(15, 2) NOT NULL,
  change_amount DECIMAL(15, 2) NOT NULL,
  change_type VARCHAR(20) NOT NULL, -- credit, debit
  reference_id UUID, -- Transaction ID or other reference
  reference_type VARCHAR(50), -- transaction, adjustment, refund
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallet_history_wallet_id ON wallet_balance_history(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_history_created_at ON wallet_balance_history(created_at);

-- Comments
COMMENT ON TABLE wallets IS 'Stores user wallet balances and limits';
COMMENT ON COLUMN wallets.balance IS 'Current wallet balance, must be non-negative';
COMMENT ON COLUMN wallets.daily_limit IS 'Maximum transaction amount per day';
COMMENT ON COLUMN wallets.monthly_limit IS 'Maximum transaction amount per month';
COMMENT ON TABLE wallet_balance_history IS 'Audit trail for all wallet balance changes';
