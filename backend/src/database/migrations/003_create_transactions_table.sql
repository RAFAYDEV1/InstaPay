-- Transactions table to store all payment transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref VARCHAR(50) UNIQUE NOT NULL, -- Unique transaction reference
  
  -- Sender information
  sender_id UUID NOT NULL REFERENCES users(id),
  sender_wallet_id UUID NOT NULL REFERENCES wallets(id),
  
  -- Receiver information
  receiver_id UUID REFERENCES users(id),
  receiver_wallet_id UUID REFERENCES wallets(id),
  receiver_phone VARCHAR(20), -- For transactions to non-users
  receiver_account_number VARCHAR(50), -- For bank transfers
  
  -- Transaction details
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'PKR' NOT NULL,
  transaction_type VARCHAR(30) NOT NULL, -- transfer, top_up, withdrawal, payment, utility_bill
  payment_method VARCHAR(30), -- wallet, bank_account, card
  
  -- Status and processing
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, processing, completed, failed, cancelled, refunded
  failure_reason TEXT,
  
  -- Fees and charges
  fee_amount DECIMAL(15, 2) DEFAULT 0.00,
  total_amount DECIMAL(15, 2) NOT NULL, -- amount + fee_amount
  
  -- Additional information
  description TEXT,
  notes TEXT,
  metadata JSONB, -- Store additional flexible data
  
  -- Reconciliation
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT check_receiver_info CHECK (
    (receiver_id IS NOT NULL AND receiver_wallet_id IS NOT NULL) OR
    (receiver_phone IS NOT NULL) OR
    (receiver_account_number IS NOT NULL)
  )
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_sender_id ON transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver_id ON transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender_wallet ON transactions(sender_wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver_wallet ON transactions(receiver_wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_ref ON transactions(transaction_ref);

-- Update trigger
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique transaction reference
CREATE OR REPLACE FUNCTION generate_transaction_ref()
RETURNS VARCHAR(50) AS $$
DECLARE
  ref VARCHAR(50);
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate reference like: TXN20240127123456789
    ref := 'TXN' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISSMS');
    
    -- Check if it exists
    SELECT EXISTS(SELECT 1 FROM transactions WHERE transaction_ref = ref) INTO exists;
    
    -- If it doesn't exist, return it
    IF NOT exists THEN
      RETURN ref;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE transactions IS 'Stores all payment and transfer transactions';
COMMENT ON COLUMN transactions.transaction_ref IS 'Unique human-readable transaction reference';
COMMENT ON COLUMN transactions.metadata IS 'Flexible JSON field for additional transaction data';
COMMENT ON COLUMN transactions.is_reconciled IS 'Whether transaction has been reconciled in accounting';
