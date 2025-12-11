const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { authenticateToken } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

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

module.exports = router;

