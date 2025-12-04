const authService = require('../services/auth.service');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
            });
        }

        // Verify JWT token
        const decoded = authService.verifyJWT(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            firebaseUid: decoded.firebaseUid,
            phoneNumber: decoded.phoneNumber,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

/**
 * Middleware to verify Firebase token (alternative authentication)
 */
const authenticateFirebase = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Firebase token required',
            });
        }

        const decodedToken = await authService.verifyFirebaseToken(token);

        req.user = {
            firebaseUid: decodedToken.uid,
            phoneNumber: decodedToken.phone_number,
        };

        next();
    } catch (error) {
        console.error('Firebase authentication error:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid Firebase token',
        });
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = authService.verifyJWT(token);
            req.user = {
                userId: decoded.userId,
                firebaseUid: decoded.firebaseUid,
                phoneNumber: decoded.phoneNumber,
            };
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

module.exports = {
    authenticateToken,
    authenticateFirebase,
    optionalAuth,
};
