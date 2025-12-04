const Joi = require('joi');

/**
 * Phone number validator
 */
const phoneNumberSchema = Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
        'string.pattern.base': 'Invalid phone number format (E.164)',
    });

/**
 * Email validator
 */
const emailSchema = Joi.string().email().required();

/**
 * UUID validator
 */
const uuidSchema = Joi.string().uuid().required();

/**
 * Amount validator (positive number with 2 decimal places)
 */
const amountSchema = Joi.number().positive().precision(2).required();

/**
 * Currency validator
 */
const currencySchema = Joi.string().length(3).uppercase().default('PKR');

/**
 * Date range validator
 */
const dateRangeSchema = Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
});

/**
 * Pagination validator
 */
const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
});

/**
 * Validate phone number
 */
const isValidPhoneNumber = (phoneNumber) => {
    const { error } = phoneNumberSchema.validate(phoneNumber);
    return !error;
};

/**
 * Validate email
 */
const isValidEmail = (email) => {
    const { error } = emailSchema.validate(email);
    return !error;
};

/**
 * Validate UUID
 */
const isValidUUID = (uuid) => {
    const { error } = uuidSchema.validate(uuid);
    return !error;
};

/**
 * Sanitize input (remove potentially harmful characters)
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
};

module.exports = {
    phoneNumberSchema,
    emailSchema,
    uuidSchema,
    amountSchema,
    currencySchema,
    dateRangeSchema,
    paginationSchema,
    isValidPhoneNumber,
    isValidEmail,
    isValidUUID,
    sanitizeInput,
};
