const express = require('express');
const router = express.Router();
const transactionService = require('../services/transaction.service');
const { validate, schemas } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const { transactionLimiter } = require('../middleware/rateLimit.middleware');

/**
 * @route   POST /api/transactions/transfer
 * @desc    Transfer money to another user
 * @access  Private
 */
router.post(
    '/transfer',
    authenticateToken,
    transactionLimiter,
    validate(schemas.transfer),
    asyncHandler(async (req, res) => {
        const { receiverId, amount, description } = req.body;

        const result = await transactionService.processTransfer(
            req.user.userId,
            receiverId,
            amount,
            description
        );

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/transactions/create
 * @desc    Create a new transaction
 * @access  Private
 */
router.post(
    '/create',
    authenticateToken,
    transactionLimiter,
    validate(schemas.createTransaction),
    asyncHandler(async (req, res) => {
        const transactionData = {
            senderId: req.user.userId,
            ...req.body,
        };

        const result = await transactionService.createTransaction(transactionData);

        res.status(201).json(result);
    })
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction details by ID
 * @access  Private
 */
router.get(
    '/:id',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        const result = await transactionService.getTransactionById(id);

        // Verify user is part of this transaction
        const transaction = result.transaction;
        if (
            transaction.sender_id !== req.user.userId &&
            transaction.receiver_id !== req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.status(200).json(result);
    })
);

/**
 * @route   GET /api/transactions/ref/:ref
 * @desc    Get transaction details by reference
 * @access  Private
 */
router.get(
    '/ref/:ref',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { ref } = req.params;

        const result = await transactionService.getTransactionByRef(ref);

        // Verify user is part of this transaction
        const transaction = result.transaction;
        if (
            transaction.sender_id !== req.user.userId &&
            transaction.receiver_id !== req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.status(200).json(result);
    })
);

/**
 * @route   GET /api/transactions
 * @desc    Get user's transactions with filters
 * @access  Private
 */
router.get(
    '/',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const filters = {
            status: req.query.status,
            transactionType: req.query.type,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            limit: parseInt(req.query.limit) || 50,
            offset: parseInt(req.query.offset) || 0,
        };

        const result = await transactionService.getUserTransactions(
            req.user.userId,
            filters
        );

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/transactions/:id/cancel
 * @desc    Cancel a pending transaction
 * @access  Private
 */
router.post(
    '/:id/cancel',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;

        // Get transaction to verify ownership
        const transactionResult = await transactionService.getTransactionById(id);

        if (transactionResult.transaction.sender_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Only sender can cancel transaction',
            });
        }

        const result = await transactionService.cancelTransaction(id, reason || 'Cancelled by user');

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/transactions/reconcile
 * @desc    Reconcile transactions (admin only - will add admin check later)
 * @access  Private
 */
router.post(
    '/reconcile',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { transactionIds } = req.body;

        if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Transaction IDs array is required',
            });
        }

        const result = await transactionService.reconcileTransactions(transactionIds);

        res.status(200).json(result);
    })
);

/**
 * @route   GET /api/transactions/unreconciled
 * @desc    Get unreconciled transactions (admin only - will add admin check later)
 * @access  Private
 */
router.get(
    '/unreconciled/list',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 100;

        const result = await transactionService.getUnreconciledTransactions(limit);

        res.status(200).json(result);
    })
);

module.exports = router;
