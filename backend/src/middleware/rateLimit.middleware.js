const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
    },
    skipSuccessfulRequests: true,
});

/**
 * OTP rate limiter - prevent OTP spam
 */
const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // 2 OTP requests per minute
    message: {
        success: false,
        message: 'Too many OTP requests, please wait before requesting again',
    },
});

/**
 * Transaction rate limiter
 */
const transactionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 transactions per minute
    message: {
        success: false,
        message: 'Too many transactions, please slow down',
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    otpLimiter,
    transactionLimiter,
};
