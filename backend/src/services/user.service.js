const { query } = require('../config/database');

class UserService {
    async getProfile(userId) {
        const result = await query(
            `SELECT id, phone_number, full_name, email, profile_image_url, created_at, updated_at
             FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return {
            success: true,
            user: result.rows[0],
        };
    }

    async updateProfile(userId, data) {
        const { fullName, email, profileImageUrl } = data;

        const result = await query(
            `UPDATE users
             SET full_name = COALESCE($1, full_name),
                 email = COALESCE($2, email),
                 profile_image_url = COALESCE($3, profile_image_url),
                 updated_at = NOW()
             WHERE id = $4
             RETURNING id, phone_number, full_name, email, profile_image_url, created_at, updated_at`,
            [fullName || null, email || null, profileImageUrl || null, userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return {
            success: true,
            user: result.rows[0],
        };
    }
}

module.exports = new UserService();

