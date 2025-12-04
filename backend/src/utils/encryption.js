const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Derive encryption key from secret
 */
const deriveKey = (secret, salt) => {
    return crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LENGTH, 'sha512');
};

/**
 * Encrypt sensitive data
 */
const encrypt = (text, secret = process.env.JWT_SECRET) => {
    try {
        const salt = crypto.randomBytes(SALT_LENGTH);
        const key = deriveKey(secret, salt);
        const iv = crypto.randomBytes(IV_LENGTH);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const tag = cipher.getAuthTag();

        // Combine salt, iv, tag, and encrypted data
        const result = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]);

        return result.toString('base64');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
};

/**
 * Decrypt sensitive data
 */
const decrypt = (encryptedData, secret = process.env.JWT_SECRET) => {
    try {
        const buffer = Buffer.from(encryptedData, 'base64');

        const salt = buffer.slice(0, SALT_LENGTH);
        const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

        const key = deriveKey(secret, salt);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hash);
};

/**
 * Generate random token
 */
const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

module.exports = {
    encrypt,
    decrypt,
    hashPassword,
    comparePassword,
    generateToken,
};
