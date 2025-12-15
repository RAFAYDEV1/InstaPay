const { query } = require('../config/database');

class UserService {
    mapUserToCamel(userRow) {
        if (!userRow) return null;
        return {
            id: userRow.id,
            phoneNumber: userRow.phone_number,
            fullName: userRow.full_name,
            email: userRow.email,
            username: userRow.username,
            profileImageUrl: userRow.profile_image_url,
            createdAt: userRow.created_at,
            updatedAt: userRow.updated_at,
        };
    }

    async getProfile(userId) {
        const result = await query(
            `SELECT id, phone_number, full_name, email, username, profile_image_url, created_at, updated_at
             FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return {
            success: true,
            user: this.mapUserToCamel(result.rows[0]),
        };
    }

    async updateProfile(userId, data) {
        const { fullName, email, profileImageUrl, username, password } = data;

        const result = await query(
            `UPDATE users
             SET full_name = COALESCE($1, full_name),
                 email = COALESCE($2, email),
                 username = COALESCE($3, username),
                 password = COALESCE($4, password),
                 profile_image_url = COALESCE($5, profile_image_url),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING id, phone_number, full_name, email, username, profile_image_url, created_at, updated_at`,
            [fullName || null, email || null, username || null, password || null, profileImageUrl || null, userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return {
            success: true,
            user: this.mapUserToCamel(result.rows[0]),
        };
    }

    async isUsernameAvailable(username) {
        const result = await query(
            `SELECT id FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1`,
            [username]
        );

        return {
            success: true,
            available: result.rows.length === 0,
        };
    }

    async changePassword(userId, oldPasswordHash, newPasswordHash) {
        const userResult = await query(
            `SELECT id, password FROM users WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const currentHash = userResult.rows[0].password;

        if (!currentHash) {
            throw new Error('No password set for this user');
        }

        if (currentHash !== oldPasswordHash) {
            return { success: false, message: 'Old password is incorrect' };
        }

        if (currentHash === newPasswordHash) {
            return { success: false, message: 'New password must be different from the old password' };
        }

        const updateResult = await query(
            `UPDATE users
             SET password = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, phone_number, full_name, email, username, profile_image_url, created_at, updated_at`,
            [newPasswordHash, userId]
        );

        return {
            success: true,
            user: this.mapUserToCamel(updateResult.rows[0]),
            message: 'Password updated successfully',
        };
    }
}

module.exports = new UserService();

