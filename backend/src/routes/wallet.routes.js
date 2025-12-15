const express = require('express');
const router = express.Router();
const walletService = require('../services/wallet.service');
const { validate, schemas } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/wallet/balance
 * @desc    Get user's wallet balance
 * @access  Private
 */
router.get(
    '/balance',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const result = await walletService.getBalance(req.user.userId);

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/wallet/create
 * @desc    Create new wallet
 * @access  Private
 */
router.post(
    '/create',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { currency, walletType } = req.body;

        const result = await walletService.createWallet(
            req.user.userId,
            currency || 'PKR',
            walletType || 'personal'
        );

        res.status(201).json(result);
    })
);

/**
 * @route   GET /api/wallet/history
 * @desc    Get wallet transaction history
 * @access  Private
 */
router.get(
    '/history',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const result = await walletService.getHistory(req.user.userId, limit, offset);

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/wallet/top-up
 * @desc    Top up wallet
 * @access  Private
 */
router.post(
    '/top-up',
    authenticateToken,
    validate(schemas.topUp),
    asyncHandler(async (req, res) => {
        const { amount, paymentMethod, metadata } = req.body;

        const result = await walletService.topUp(
            req.user.userId,
            amount,
            paymentMethod,
            metadata
        );

        res.status(200).json(result);
    })
);

/**
 * @route   GET /api/wallet/balance-history
 * @desc    Get wallet balance change history
 * @access  Private
 */
router.get(
    '/balance-history',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        // Get user's primary wallet
        const walletResult = await walletService.getBalance(req.user.userId);
        const walletId = walletResult.wallet.id;

        const result = await walletService.getBalanceHistory(walletId, limit, offset);

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/wallet/test-credit
 * @desc    Credit test balance to the authenticated user's wallet (non-production only)
 * @access  Private
 */
if (process.env.NODE_ENV !== 'production') {
    router.post(
        '/test-credit',
        authenticateToken,
        asyncHandler(async (req, res) => {
            const { amount } = req.body || {};

            // Default to 10,000 if no amount is provided
            const creditAmount = parseFloat(amount) || 10000;

            const result = await walletService.topUp(
                req.user.userId,
                creditAmount,
                'test_credit',
                { reason: 'test-balance', environment: process.env.NODE_ENV || 'development' }
            );

            res.status(200).json(result);
        })
    );
}

module.exports = router;
