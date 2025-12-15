const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const firebaseService = require('../services/firebase.service');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

// In-memory storage for profile image uploads
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
    '/profile',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const result = await userService.getProfile(req.user.userId);
        res.status(200).json(result);
    })
);

/**
 * @route   PUT /api/user/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
    '/profile',
    authenticateToken,
    validate(schemas.updateProfile),
    asyncHandler(async (req, res) => {
        const result = await userService.updateProfile(req.user.userId, req.body);
        res.status(200).json(result);
    })
);

/**
 * @route   PUT /api/user/profile/password
 * @desc    Change password (expects hashed passwords from client)
 * @access  Private
 */
router.put(
    '/profile/password',
    authenticateToken,
    validate(schemas.changePassword),
    asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const result = await userService.changePassword(req.user.userId, oldPassword, newPassword);
        const status = result.success ? 200 : 400;
        res.status(status).json(result);
    })
);

/**
 * @route   GET /api/user/check-username
 * @desc    Check if a username is available
 * @access  Public
 */
router.get(
    '/check-username',
    asyncHandler(async (req, res) => {
        const username = (req.query.username || '').toString();
        if (!username || username.length < 3) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }

        const result = await userService.isUsernameAvailable(username);
        res.status(200).json(result);
    })
);

/**
 * @route   POST /api/user/upload-profile-image
 * @desc    Upload and attach profile image
 * @access  Private
 */
router.post(
    '/upload-profile-image',
    authenticateToken,
    upload.single('image'),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const result = await firebaseService.uploadProfileImage(
            req.user.userId,
            req.file.buffer,
            req.file.mimetype || 'image/jpeg'
        );

        res.status(200).json(result);
    })
);

module.exports = router;

