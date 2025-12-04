const { query, getClient } = require('../config/database');
const walletService = require('./wallet.service');
const firebaseService = require('./firebase.service');

class TransactionService {
    /**
     * Create a new transaction
     */
    async createTransaction(data) {
        const client = await getClient();

        try {
            await client.query('BEGIN');

            const transactionRef = await this.generateTransactionRef(client);

            const result = await client.query(
                `INSERT INTO transactions 
         (transaction_ref, sender_id, sender_wallet_id, receiver_id, receiver_wallet_id,
          receiver_phone, receiver_account_number, amount, currency, transaction_type,
          payment_method, status, fee_amount, total_amount, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING *`,
                [
                    transactionRef,
                    data.senderId,
                    data.senderWalletId,
                    data.receiverId || null,
                    data.receiverWalletId || null,
                    data.receiverPhone || null,
                    data.receiverAccountNumber || null,
                    data.amount,
                    data.currency || 'PKR',
                    data.transactionType,
                    data.paymentMethod || 'wallet',
                    'pending',
                    data.feeAmount || 0,
                    parseFloat(data.amount) + parseFloat(data.feeAmount || 0),
                    data.description || null,
                    data.metadata ? JSON.stringify(data.metadata) : null,
                ]
            );

            await client.query('COMMIT');

            return {
                success: true,
                transaction: result.rows[0],
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error creating transaction:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Process a wallet-to-wallet transfer
     */
    async processTransfer(senderId, receiverId, amount, description = null) {
        const client = await getClient();

        try {
            await client.query('BEGIN');

            // Get sender's wallet
            const senderWalletResult = await client.query(
                `SELECT * FROM wallets WHERE user_id = $1 AND is_primary = true AND status = 'active' FOR UPDATE`,
                [senderId]
            );

            if (senderWalletResult.rows.length === 0) {
                throw new Error('Sender wallet not found');
            }

            const senderWallet = senderWalletResult.rows[0];

            // Get receiver's wallet
            const receiverWalletResult = await client.query(
                `SELECT * FROM wallets WHERE user_id = $1 AND is_primary = true AND status = 'active' FOR UPDATE`,
                [receiverId]
            );

            if (receiverWalletResult.rows.length === 0) {
                throw new Error('Receiver wallet not found');
            }

            const receiverWallet = receiverWalletResult.rows[0];

            // Check if currencies match
            if (senderWallet.currency !== receiverWallet.currency) {
                throw new Error('Currency mismatch');
            }

            // Check sufficient balance
            const senderBalance = parseFloat(senderWallet.balance);
            const transferAmount = parseFloat(amount);

            if (senderBalance < transferAmount) {
                throw new Error('Insufficient balance');
            }

            // Create transaction
            const transactionRef = await this.generateTransactionRef(client);
            const transactionResult = await client.query(
                `INSERT INTO transactions 
         (transaction_ref, sender_id, sender_wallet_id, receiver_id, receiver_wallet_id,
          amount, currency, transaction_type, payment_method, status, total_amount, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
                [
                    transactionRef,
                    senderId,
                    senderWallet.id,
                    receiverId,
                    receiverWallet.id,
                    transferAmount,
                    senderWallet.currency,
                    'transfer',
                    'wallet',
                    'processing',
                    transferAmount,
                    description,
                ]
            );

            const transaction = transactionResult.rows[0];

            // Debit sender's wallet
            const newSenderBalance = senderBalance - transferAmount;
            await client.query(
                `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
                [newSenderBalance, senderWallet.id]
            );

            await client.query(
                `INSERT INTO wallet_balance_history 
         (wallet_id, old_balance, new_balance, change_amount, change_type, reference_id, reference_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [senderWallet.id, senderBalance, newSenderBalance, transferAmount, 'debit', transaction.id, 'transaction']
            );

            // Credit receiver's wallet
            const receiverBalance = parseFloat(receiverWallet.balance);
            const newReceiverBalance = receiverBalance + transferAmount;
            await client.query(
                `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
                [newReceiverBalance, receiverWallet.id]
            );

            await client.query(
                `INSERT INTO wallet_balance_history 
         (wallet_id, old_balance, new_balance, change_amount, change_type, reference_id, reference_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [receiverWallet.id, receiverBalance, newReceiverBalance, transferAmount, 'credit', transaction.id, 'transaction']
            );

            // Update transaction status to completed
            await client.query(
                `UPDATE transactions SET status = $1, completed_at = NOW() WHERE id = $2`,
                ['completed', transaction.id]
            );

            await client.query('COMMIT');

            // Send notifications
            await Promise.all([
                firebaseService.sendTransactionNotification(senderId, {
                    ...transaction,
                    status: 'completed',
                }),
                firebaseService.sendTransactionNotification(receiverId, {
                    ...transaction,
                    status: 'completed',
                }),
            ]);

            return {
                success: true,
                transaction: {
                    ...transaction,
                    status: 'completed',
                },
                senderNewBalance: newSenderBalance,
                receiverNewBalance: newReceiverBalance,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error processing transfer:', error);

            // Update transaction status to failed if it was created
            // (handled separately to avoid nested transactions)

            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get transaction by ID
     */
    async getTransactionById(transactionId) {
        try {
            const result = await query(
                `SELECT t.*, 
                sender.full_name as sender_name, sender.phone_number as sender_phone,
                receiver.full_name as receiver_name, receiver.phone_number as receiver_phone
         FROM transactions t
         LEFT JOIN users sender ON t.sender_id = sender.id
         LEFT JOIN users receiver ON t.receiver_id = receiver.id
         WHERE t.id = $1`,
                [transactionId]
            );

            if (result.rows.length === 0) {
                throw new Error('Transaction not found');
            }

            return {
                success: true,
                transaction: result.rows[0],
            };
        } catch (error) {
            console.error('Error getting transaction:', error);
            throw error;
        }
    }

    /**
     * Get transaction by reference
     */
    async getTransactionByRef(transactionRef) {
        try {
            const result = await query(
                `SELECT t.*, 
                sender.full_name as sender_name,
                receiver.full_name as receiver_name
         FROM transactions t
         LEFT JOIN users sender ON t.sender_id = sender.id
         LEFT JOIN users receiver ON t.receiver_id = receiver.id
         WHERE t.transaction_ref = $1`,
                [transactionRef]
            );

            if (result.rows.length === 0) {
                throw new Error('Transaction not found');
            }

            return {
                success: true,
                transaction: result.rows[0],
            };
        } catch (error) {
            console.error('Error getting transaction:', error);
            throw error;
        }
    }

    /**
     * Reconcile transactions
     */
    async reconcileTransactions(transactionIds) {
        try {
            const result = await query(
                `UPDATE transactions 
         SET is_reconciled = true, reconciled_at = NOW() 
         WHERE id = ANY($1) AND status = 'completed'
         RETURNING *`,
                [transactionIds]
            );

            return {
                success: true,
                reconciledCount: result.rows.length,
                transactions: result.rows,
            };
        } catch (error) {
            console.error('Error reconciling transactions:', error);
            throw error;
        }
    }

    /**
     * Get unreconciled transactions
     */
    async getUnreconciledTransactions(limit = 100) {
        try {
            const result = await query(
                `SELECT t.*, 
                sender.full_name as sender_name,
                receiver.full_name as receiver_name
         FROM transactions t
         LEFT JOIN users sender ON t.sender_id = sender.id
         LEFT JOIN users receiver ON t.receiver_id = receiver.id
         WHERE t.is_reconciled = false AND t.status = 'completed'
         ORDER BY t.completed_at ASC
         LIMIT $1`,
                [limit]
            );

            return {
                success: true,
                transactions: result.rows,
                count: result.rows.length,
            };
        } catch (error) {
            console.error('Error getting unreconciled transactions:', error);
            throw error;
        }
    }

    /**
     * Cancel transaction
     */
    async cancelTransaction(transactionId, reason) {
        try {
            const result = await query(
                `UPDATE transactions 
         SET status = 'cancelled', failure_reason = $1, updated_at = NOW()
         WHERE id = $2 AND status = 'pending'
         RETURNING *`,
                [reason, transactionId]
            );

            if (result.rows.length === 0) {
                throw new Error('Transaction not found or cannot be cancelled');
            }

            return {
                success: true,
                transaction: result.rows[0],
            };
        } catch (error) {
            console.error('Error cancelling transaction:', error);
            throw error;
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
     * Get user transactions with filters
     */
    async getUserTransactions(userId, filters = {}) {
        try {
            let queryText = `
        SELECT t.*, 
               sender.full_name as sender_name,
               receiver.full_name as receiver_name
        FROM transactions t
        LEFT JOIN users sender ON t.sender_id = sender.id
        LEFT JOIN users receiver ON t.receiver_id = receiver.id
        WHERE (t.sender_id = $1 OR t.receiver_id = $1)
      `;

            const params = [userId];
            let paramCount = 1;

            if (filters.status) {
                paramCount++;
                queryText += ` AND t.status = $${paramCount}`;
                params.push(filters.status);
            }

            if (filters.transactionType) {
                paramCount++;
                queryText += ` AND t.transaction_type = $${paramCount}`;
                params.push(filters.transactionType);
            }

            if (filters.startDate) {
                paramCount++;
                queryText += ` AND t.created_at >= $${paramCount}`;
                params.push(filters.startDate);
            }

            if (filters.endDate) {
                paramCount++;
                queryText += ` AND t.created_at <= $${paramCount}`;
                params.push(filters.endDate);
            }

            queryText += ` ORDER BY t.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
            params.push(filters.limit || 50, filters.offset || 0);

            const result = await query(queryText, params);

            return {
                success: true,
                transactions: result.rows,
                count: result.rows.length,
            };
        } catch (error) {
            console.error('Error getting user transactions:', error);
            throw error;
        }
    }
}

module.exports = new TransactionService();
