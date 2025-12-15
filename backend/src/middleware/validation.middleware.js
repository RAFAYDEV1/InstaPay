const Joi = require('joi');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        next();
    };
};

/**
 * Validation schemas
 */
const schemas = {
    // Auth schemas
    sendOTP: Joi.object({
        phoneNumber: Joi.string()
            .pattern(/^\+?[1-9]\d{1,14}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid phone number format',
            }),
    }),

    verifyOTP: Joi.object({
        phoneNumber: Joi.string()
            .pattern(/^\+?[1-9]\d{1,14}$/)
            .required(),
        otp: Joi.string().length(6).required(),
        deviceFingerprint: Joi.string().optional(),
        fcmToken: Joi.string().optional(),
    }),

    updateProfile: Joi.object({
        fullName: Joi.string().min(2).max(100).optional(),
        email: Joi.string().email().optional(),
        username: Joi.string().alphanum().min(3).max(30).optional(),
        // Password arrives pre-hashed with SHA-256 from the client
        password: Joi.string().length(64).hex().optional(),
        profileImageUrl: Joi.string().uri().optional(),
    }),

    changePassword: Joi.object({
        // Passwords are SHA-256 hashes from client
        oldPassword: Joi.string().length(64).hex().required(),
        newPassword: Joi.string().length(64).hex().required(),
    }),

    // Wallet schemas
    topUp: Joi.object({
        amount: Joi.number().positive().precision(2).required(),
        paymentMethod: Joi.string()
            .valid('bank_account', 'debit_card', 'credit_card')
            .required(),
        metadata: Joi.object().optional(),
    }),

    // Transaction schemas
    transfer: Joi.object({
        receiverId: Joi.string().uuid().optional(),
        receiverPhone: Joi.string()
            .pattern(/^\+?[1-9]\d{1,14}$/)
            .optional(),
        amount: Joi.number().positive().precision(2).required(),
        description: Joi.string().max(500).optional(),
    }).xor('receiverId', 'receiverPhone'),

    createTransaction: Joi.object({
        receiverId: Joi.string().uuid().optional(),
        receiverPhone: Joi.string().optional(),
        receiverAccountNumber: Joi.string().optional(),
        amount: Joi.number().positive().precision(2).required(),
        transactionType: Joi.string()
            .valid('transfer', 'payment', 'withdrawal', 'utility_bill')
            .required(),
        paymentMethod: Joi.string()
            .valid('wallet', 'bank_account', 'card')
            .optional(),
        description: Joi.string().max(500).optional(),
        metadata: Joi.object().optional(),
    }).or('receiverId', 'receiverPhone', 'receiverAccountNumber'),

    // Admin schemas
    suspendUser: Joi.object({
        reason: Joi.string().required(),
        suspensionType: Joi.string().valid('temporary', 'permanent').required(),
        expiresAt: Joi.date().optional(),
    }),
};

module.exports = {
    validate,
    schemas,
};
