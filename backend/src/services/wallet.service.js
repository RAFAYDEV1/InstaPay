const { query, getClient } = require('../config/database');
const firebaseService = require('./firebase.service');

class WalletService {
    /**
     * Get user's wallet balance
     */
    async getBalance(userId) {
        try {
            const result = await query(
                `SELECT w.*, u.phone_number, u.full_name 
         FROM wallets w
         JOIN users u ON w.user_id = u.id
         WHERE w.user_id = $1 AND w.is_primary = true AND w.status = 'active'`,
                [userId]
            );

            if (result.rows.length === 0) {
                throw new Error('Wallet not found');
            }

            return {
                success: true,
                wallet: result.rows[0],
            };
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            throw error;
        }
    }

    /**
     * Get wallet by ID
     */
    async getWalletById(walletId) {
        try {
            const result = await query(
                `SELECT * FROM wallets WHERE id = $1`,
                [walletId]
            );

            if (result.rows.length === 0) {
                throw new Error('Wallet not found');
            }

            return result.rows[0];
        } catch (error) {
            console.error('Error getting wallet:', error);
            throw error;
        }
    }

    /**
     * Create new wallet for user
     */
    async createWallet(userId, currency = 'PKR', walletType = 'personal') {
        try {
            const result = await query(
                `INSERT INTO wallets (user_id, balance, currency, wallet_type, is_primary)
         VALUES ($1, 0.00, $2, $3, false)
         RETURNING *`,
                [userId, currency, walletType]
            );

            return {
                success: true,
                wallet: result.rows[0],
            };
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw new Error('Failed to create wallet');
        }
    }

    /**
     * Update wallet balance (with transaction lock)
     */
    async updateBalance(walletId, amount, changeType, referenceId, referenceType, notes = null) {
        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Lock the wallet row for update
            const walletResult = await client.query(
                `SELECT * FROM wallets WHERE id = $1 FOR UPDATE`,
                [walletId]
            );

            if (walletResult.rows.length === 0) {
                throw new Error('Wallet not found');
            }

            const wallet = walletResult.rows[0];
            const oldBalance = parseFloat(wallet.balance);
            let newBalance;

            if (changeType === 'credit') {
                newBalance = oldBalance + parseFloat(amount);
            } else if (changeType === 'debit') {
                newBalance = oldBalance - parseFloat(amount);

                if (newBalance < 0) {
                    throw new Error('Insufficient balance');
                }
            } else {
                throw new Error('Invalid change type');
            }

            // Update wallet balance
            await client.query(
                `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
                [newBalance, walletId]
            );

            // Record balance change in history
            await client.query(
                `INSERT INTO wallet_balance_history 
         (wallet_id, old_balance, new_balance, change_amount, change_type, reference_id, reference_type, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [walletId, oldBalance, newBalance, amount, changeType, referenceId, referenceType, notes]
            );

            await client.query('COMMIT');

            // Send notification
            await firebaseService.sendWalletNotification(
                wallet.user_id,
                `Your wallet has been ${changeType === 'credit' ? 'credited' : 'debited'} with ${wallet.currency} ${amount}`,
                { oldBalance, newBalance, amount }
            );

            return {
                success: true,
                oldBalance,
                newBalance,
                changeAmount: amount,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating wallet balance:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get wallet transaction history
     */
    async getHistory(userId, limit = 50, offset = 0) {
        try {
            const result = await query(
                `SELECT t.*, 
                sender.full_name as sender_name,
                receiver.full_name as receiver_name
         FROM transactions t
         LEFT JOIN users sender ON t.sender_id = sender.id
         LEFT JOIN users receiver ON t.receiver_id = receiver.id
         WHERE t.sender_id = $1 OR t.receiver_id = $1
         ORDER BY t.created_at DESC
         LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            );

            return {
                success: true,
                transactions: result.rows,
                count: result.rows.length,
            };
        } catch (error) {
            console.error('Error getting wallet history:', error);
            throw error;
        }
    }

    /**
     * Top up wallet (from external source)
     */
    async topUp(userId, amount, paymentMethod, metadata = {}) {
        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Get user's primary wallet
            const walletResult = await client.query(
                `SELECT * FROM wallets WHERE user_id = $1 AND is_primary = true FOR UPDATE`,
                [userId]
            );

            if (walletResult.rows.length === 0) {
                throw new Error('Wallet not found');
            }

            const wallet = walletResult.rows[0];

            // Create transaction record
            const transactionRef = await this.generateTransactionRef(client);
            const transactionResult = await client.query(
                `INSERT INTO transactions 
         (transaction_ref, sender_id, sender_wallet_id, receiver_id, receiver_wallet_id,
          amount, currency, transaction_type, payment_method, status, total_amount, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
                [
                    transactionRef,
                    userId,
                    wallet.id,
                    userId,
                    wallet.id,
                    amount,
                    wallet.currency,
                    'top_up',
                    paymentMethod,
                    'completed',
                    amount,
                    JSON.stringify(metadata),
                ]
            );

            const transaction = transactionResult.rows[0];

            // Update wallet balance
            const oldBalance = parseFloat(wallet.balance);
            const newBalance = oldBalance + parseFloat(amount);

            await client.query(
                `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
                [newBalance, wallet.id]
            );

            // Record in balance history
            await client.query(
                `INSERT INTO wallet_balance_history 
         (wallet_id, old_balance, new_balance, change_amount, change_type, reference_id, reference_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [wallet.id, oldBalance, newBalance, amount, 'credit', transaction.id, 'transaction']
            );

            await client.query('COMMIT');

            // Send notification
            await firebaseService.sendTransactionNotification(userId, transaction);

            return {
                success: true,
                transaction,
                newBalance,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error topping up wallet:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Generate unique transaction reference
     */
    async generateTransactionRef(client) {
        const result = await client.query('SELECT generate_transaction_ref() as ref');
        return result.rows[0].ref;
    }

    /**
     * Check if user has sufficient balance
     */
    async hasSufficientBalance(walletId, amount) {
        try {
            const wallet = await this.getWalletById(walletId);
            return parseFloat(wallet.balance) >= parseFloat(amount);
        } catch (error) {
            return false;
        }
    }

    /**
     * Get wallet balance history
     */
    async getBalanceHistory(walletId, limit = 50, offset = 0) {
        try {
            const result = await query(
                `SELECT * FROM wallet_balance_history 
         WHERE wallet_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
                [walletId, limit, offset]
            );

            return {
                success: true,
                history: result.rows,
            };
        } catch (error) {
            console.error('Error getting balance history:', error);
            throw error;
        }
    }
}

module.exports = new WalletService();
