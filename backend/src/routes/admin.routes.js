const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (paginated)
 * @access  Admin
 */
router.get(
    '/users',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const search = req.query.search || '';

        let queryText = `
      SELECT u.*, w.balance as wallet_balance, w.currency
      FROM users u
      LEFT JOIN wallets w ON u.id = w.user_id AND w.is_primary = true
      WHERE 1=1
    `;

        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            queryText += ` AND (u.phone_number ILIKE $${paramCount} OR u.full_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        queryText += ` ORDER BY u.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        res.status(200).json({
            success: true,
            users: result.rows,
            count: result.rows.length,
        });
    })
);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get system analytics
 * @access  Admin
 */
router.get(
    '/analytics',
    authenticateToken,
    asyncHandler(async (req, res) => {
        // Get total users
        const usersResult = await query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(usersResult.rows[0].count);

        // Get active users (logged in last 30 days)
        const activeUsersResult = await query(
            `SELECT COUNT(*) as count FROM users 
       WHERE last_login_at > NOW() - INTERVAL '30 days'`
        );
        const activeUsers = parseInt(activeUsersResult.rows[0].count);

        // Get total transactions
        const transactionsResult = await query('SELECT COUNT(*) as count FROM transactions');
        const totalTransactions = parseInt(transactionsResult.rows[0].count);

        // Get total transaction volume
        const volumeResult = await query(
            `SELECT SUM(amount) as volume, currency 
       FROM transactions 
       WHERE status = 'completed'
       GROUP BY currency`
        );

        // Get transactions by status
        const statusResult = await query(
            `SELECT status, COUNT(*) as count 
       FROM transactions 
       GROUP BY status`
        );

        // Get recent transactions
        const recentResult = await query(
            `SELECT t.*, 
              sender.full_name as sender_name,
              receiver.full_name as receiver_name
       FROM transactions t
       LEFT JOIN users sender ON t.sender_id = sender.id
       LEFT JOIN users receiver ON t.receiver_id = receiver.id
       ORDER BY t.created_at DESC
       LIMIT 10`
        );

        res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                activeUsers,
                totalTransactions,
                transactionVolume: volumeResult.rows,
                transactionsByStatus: statusResult.rows,
                recentTransactions: recentResult.rows,
            },
        });
    })
);

/**
 * @route   POST /api/admin/user/:id/suspend
 * @desc    Suspend a user
 * @access  Admin
 */
router.post(
    '/user/:id/suspend',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { reason, suspensionType, expiresAt } = req.body;

        if (!reason || !suspensionType) {
            return res.status(400).json({
                success: false,
                message: 'Reason and suspension type are required',
            });
        }

        // Deactivate user
        await query(
            `UPDATE users SET is_active = false WHERE id = $1`,
            [id]
        );

        // Create suspension record
        const result = await query(
            `INSERT INTO user_suspensions 
       (user_id, admin_id, reason, suspension_type, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [id, req.user.userId, reason, suspensionType, expiresAt || null]
        );

        res.status(200).json({
            success: true,
            suspension: result.rows[0],
        });
    })
);

/**
 * @route   POST /api/admin/user/:id/activate
 * @desc    Activate/unsuspend a user
 * @access  Admin
 */
router.post(
    '/user/:id/activate',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Activate user
        await query(
            `UPDATE users SET is_active = true WHERE id = $1`,
            [id]
        );

        // Mark suspensions as inactive
        await query(
            `UPDATE user_suspensions 
       SET is_active = false, lifted_at = NOW(), lifted_by = $1
       WHERE user_id = $2 AND is_active = true`,
            [req.user.userId, id]
        );

        res.status(200).json({
            success: true,
            message: 'User activated successfully',
        });
    })
);

/**
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions (paginated with filters)
 * @access  Admin
 */
router.get(
    '/transactions',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const status = req.query.status;
        const type = req.query.type;

        let queryText = `
      SELECT t.*, 
             sender.full_name as sender_name, sender.phone_number as sender_phone,
             receiver.full_name as receiver_name, receiver.phone_number as receiver_phone
      FROM transactions t
      LEFT JOIN users sender ON t.sender_id = sender.id
      LEFT JOIN users receiver ON t.receiver_id = receiver.id
      WHERE 1=1
    `;

        const params = [];
        let paramCount = 0;

        if (status) {
            paramCount++;
            queryText += ` AND t.status = $${paramCount}`;
            params.push(status);
        }

        if (type) {
            paramCount++;
            queryText += ` AND t.transaction_type = $${paramCount}`;
            params.push(type);
        }

        queryText += ` ORDER BY t.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await query(queryText, params);

        res.status(200).json({
            success: true,
            transactions: result.rows,
            count: result.rows.length,
        });
    })
);

/**
 * @route   GET /api/admin/user/:id
 * @desc    Get user details with wallet and transaction info
 * @access  Admin
 */
router.get(
    '/user/:id',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Get user info
        const userResult = await query(
            `SELECT u.*, w.balance, w.currency, w.status as wallet_status
       FROM users u
       LEFT JOIN wallets w ON u.id = w.user_id AND w.is_primary = true
       WHERE u.id = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Get user's transaction stats
        const statsResult = await query(
            `SELECT 
         COUNT(*) as total_transactions,
         SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_volume,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
         COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions
       FROM transactions
       WHERE sender_id = $1 OR receiver_id = $1`,
            [id]
        );

        res.status(200).json({
            success: true,
            user: userResult.rows[0],
            stats: statsResult.rows[0],
        });
    })
);

module.exports = router;
