const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const firebaseService = require('../services/firebase.service');
const { validate, schemas } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { authLimiter, otpLimiter } = require('../middleware/rateLimit.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to phone number
 * @access  Public
 */
router.post(
    '/send-otp',
    otpLimiter,
    validate(schemas.sendOTP),
    asyncHandler(async (req, res) => {
        const { phoneNumber } = req.body;

        const result = await authService.sendOTP(phoneNumber);

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and authenticate user
 * @access  Public
 */
router.post(
    '/verify-otp',
    authLimiter,
    validate(schemas.verifyOTP),
    asyncHandler(async (req, res) => {
        const { phoneNumber, otp, deviceFingerprint, fcmToken } = req.body;

        const result = await authService.verifyOTP(phoneNumber, otp, deviceFingerprint);

        // Update FCM token if provided
        if (result.success && fcmToken && result.user.id) {
            await firebaseService.updateFCMToken(result.user.id, fcmToken);
        }

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh authentication token
 * @access  Private
 */
router.post(
    '/refresh-token',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const result = await authService.refreshToken(req.user.userId);

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
    '/logout',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const result = await authService.logout(req.user.userId);

        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/auth/update-fcm-token
 * @desc    Update FCM token for push notifications
 * @access  Private
 */
router.post(
    '/update-fcm-token',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { fcmToken } = req.body;

        if (!fcmToken) {
            return res.status(400).json({
                success: false,
                message: 'FCM token is required',
            });
        }

        const result = await firebaseService.updateFCMToken(req.user.userId, fcmToken);

        res.status(200).json(result);
    })
);

module.exports = router;
