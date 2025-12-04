const { getAuth } = require('../config/firebase');
const { query } = require('../config/database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
    /**
     * Generate OTP code
     */
    generateOTP() {
        const length = parseInt(process.env.OTP_LENGTH) || 6;
        const otp = crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
        return otp;
    }

    /**
     * Send OTP via Firebase (SMS)
     * Note: You'll need to implement actual SMS sending via Firebase or third-party service
     */
    async sendOTP(phoneNumber) {
        try {
            const otp = this.generateOTP();
            const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
            const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

            // Store OTP in database
            await query(
                `INSERT INTO otp_verifications (phone_number, otp_code, expires_at) 
         VALUES ($1, $2, $3)`,
                [phoneNumber, otp, expiresAt]
            );

            // TODO: Implement actual SMS sending
            // For now, we'll just log it (REMOVE IN PRODUCTION)
            console.log(`📱 OTP for ${phoneNumber}: ${otp}`);

            return {
                success: true,
                message: 'OTP sent successfully',
                expiresAt,
            };
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Failed to send OTP');
        }
    }

    /**
     * Verify OTP and create/update user
     */
    async verifyOTP(phoneNumber, otp, deviceFingerprint) {
        try {
            // Check OTP validity
            const otpResult = await query(
                `SELECT * FROM otp_verifications 
         WHERE phone_number = $1 AND otp_code = $2 
         AND expires_at > NOW() AND is_used = false
         ORDER BY created_at DESC LIMIT 1`,
                [phoneNumber, otp]
            );

            if (otpResult.rows.length === 0) {
                return {
                    success: false,
                    message: 'Invalid or expired OTP',
                };
            }

            // Mark OTP as used
            await query(
                `UPDATE otp_verifications SET is_used = true WHERE id = $1`,
                [otpResult.rows[0].id]
            );

            // Create Firebase custom token
            const auth = getAuth();
            const firebaseToken = await auth.createCustomToken(phoneNumber);

            // Check if user exists
            let userResult = await query(
                `SELECT * FROM users WHERE phone_number = $1`,
                [phoneNumber]
            );

            let user;
            let isNewUser = false;

            if (userResult.rows.length === 0) {
                // Create new user
                isNewUser = true;

                // Create Firebase user
                let firebaseUser;
                try {
                    firebaseUser = await auth.createUser({
                        phoneNumber: phoneNumber,
                    });
                } catch (error) {
                    // User might already exist in Firebase
                    firebaseUser = await auth.getUserByPhoneNumber(phoneNumber);
                }

                // Create user in database
                const newUserResult = await query(
                    `INSERT INTO users (firebase_uid, phone_number, device_fingerprint, is_verified, last_login_at)
           VALUES ($1, $2, $3, true, NOW())
           RETURNING *`,
                    [firebaseUser.uid, phoneNumber, deviceFingerprint]
                );

                user = newUserResult.rows[0];

                // Create default wallet for new user
                await query(
                    `INSERT INTO wallets (user_id, balance, currency, is_primary)
           VALUES ($1, 0.00, $2, true)`,
                    [user.id, process.env.DEFAULT_CURRENCY || 'PKR']
                );
            } else {
                // Update existing user
                user = userResult.rows[0];
                await query(
                    `UPDATE users 
           SET device_fingerprint = $1, last_login_at = NOW(), is_verified = true
           WHERE id = $2`,
                    [deviceFingerprint, user.id]
                );
            }

            // Generate JWT token
            const jwtToken = jwt.sign(
                {
                    userId: user.id,
                    firebaseUid: user.firebase_uid,
                    phoneNumber: user.phone_number,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return {
                success: true,
                isNewUser,
                user: {
                    id: user.id,
                    phoneNumber: user.phone_number,
                    fullName: user.full_name,
                    email: user.email,
                    profileImageUrl: user.profile_image_url,
                },
                tokens: {
                    accessToken: jwtToken,
                    firebaseToken,
                },
            };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Failed to verify OTP');
        }
    }

    /**
     * Verify Firebase token
     */
    async verifyFirebaseToken(token) {
        try {
            const auth = getAuth();
            const decodedToken = await auth.verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            console.error('Error verifying Firebase token:', error);
            throw new Error('Invalid Firebase token');
        }
    }

    /**
     * Verify JWT token
     */
    verifyJWT(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            console.error('Error verifying JWT:', error);
            throw new Error('Invalid JWT token');
        }
    }

    /**
     * Refresh authentication token
     */
    async refreshToken(userId) {
        try {
            const userResult = await query(
                `SELECT * FROM users WHERE id = $1 AND is_active = true`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                throw new Error('User not found or inactive');
            }

            const user = userResult.rows[0];

            const jwtToken = jwt.sign(
                {
                    userId: user.id,
                    firebaseUid: user.firebase_uid,
                    phoneNumber: user.phone_number,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return {
                success: true,
                accessToken: jwtToken,
            };
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    /**
     * Logout user (invalidate FCM token)
     */
    async logout(userId) {
        try {
            await query(
                `UPDATE users SET fcm_token = NULL WHERE id = $1`,
                [userId]
            );

            return {
                success: true,
                message: 'Logged out successfully',
            };
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();
