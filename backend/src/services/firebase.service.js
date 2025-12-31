const cloudinary = require('../config/cloudinary');
const { getMessaging } = require('../config/firebase');
const { query } = require('../config/database');

class FirebaseService {
    /**
     * Upload profile image to Cloudinary
     */
    async uploadProfileImage(userId, imageBuffer, mimeType) {
        try {
            // Upload to Cloudinary using upload_stream
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: process.env.CLOUDINARY_FOLDER || 'instapay/profile-images',
                        public_id: `user_${userId}_${Date.now()}`,
                        resource_type: 'image',
                        format: mimeType.split('/')[1] || 'jpg',
                        transformation: [
                            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                            { quality: 'auto' },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                // Write buffer to stream
                uploadStream.end(imageBuffer);
            });

            const publicUrl = uploadResult.secure_url;

            // Update user profile image URL in database
            await query(
                `UPDATE users SET profile_image_url = $1, updated_at = NOW() WHERE id = $2`,
                [publicUrl, userId]
            );

            return {
                success: true,
                imageUrl: publicUrl,
                publicId: uploadResult.public_id,
            };
        } catch (error) {
            console.error('Error uploading profile image:', error);
            throw new Error('Failed to upload profile image');
        }
    }

    /**
     * Delete profile image from Cloudinary
     */
    async deleteProfileImage(imageUrl) {
        try {
            // Extract public_id from Cloudinary URL
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            const urlParts = imageUrl.split('/');
            const fileNameWithExt = urlParts[urlParts.length - 1];
            const fileName = fileNameWithExt.split('.')[0];

            // Get folder path
            const folderIndex = urlParts.indexOf('upload') + 2; // Skip version number
            const publicIdParts = urlParts.slice(folderIndex, -1);
            publicIdParts.push(fileName);
            const publicId = publicIdParts.join('/');

            await cloudinary.uploader.destroy(publicId);

            return { success: true };
        } catch (error) {
            console.error('Error deleting profile image:', error);
            // Don't throw error, just log it
            return { success: false };
        }
    }

    /**
     * Send push notification to user
     */
    async sendPushNotification(userId, notification) {
        try {
            // Get user's FCM token
            const userResult = await query(
                `SELECT fcm_token FROM users WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0 || !userResult.rows[0].fcm_token) {
                console.log(`No FCM token found for user ${userId}`);
                return { success: false, message: 'No FCM token found' };
            }

            const fcmToken = userResult.rows[0].fcm_token;

            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                token: fcmToken,
            };

            const messaging = getMessaging();
            const response = await messaging.send(message);

            console.log('Successfully sent notification:', response);

            return {
                success: true,
                messageId: response,
            };
        } catch (error) {
            console.error('Error sending push notification:', error);

            // If token is invalid, remove it from database
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                await query(
                    `UPDATE users SET fcm_token = NULL WHERE id = $1`,
                    [userId]
                );
            }

            throw new Error('Failed to send push notification');
        }
    }

    /**
     * Send push notification to multiple users
     */
    async sendMulticastNotification(userIds, notification) {
        try {
            // Get FCM tokens for all users
            const tokensResult = await query(
                `SELECT fcm_token FROM users WHERE id = ANY($1) AND fcm_token IS NOT NULL`,
                [userIds]
            );

            if (tokensResult.rows.length === 0) {
                return { success: false, message: 'No valid FCM tokens found' };
            }

            const tokens = tokensResult.rows.map(row => row.fcm_token);

            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                tokens: tokens,
            };

            const messaging = getMessaging();
            const response = await messaging.sendMulticast(message);

            console.log(`Successfully sent ${response.successCount} notifications`);

            return {
                success: true,
                successCount: response.successCount,
                failureCount: response.failureCount,
            };
        } catch (error) {
            console.error('Error sending multicast notification:', error);
            throw new Error('Failed to send multicast notification');
        }
    }

    /**
     * Update user's FCM token
     */
    async updateFCMToken(userId, fcmToken) {
        try {
            await query(
                `UPDATE users SET fcm_token = $1, updated_at = NOW() WHERE id = $2`,
                [fcmToken, userId]
            );

            return { success: true };
        } catch (error) {
            console.error('Error updating FCM token:', error);
            throw new Error('Failed to update FCM token');
        }
    }

    /**
     * Send transaction notification
     */
    async sendTransactionNotification(userId, transaction, senderName = null, receiverName = null) {
        // Format amount with currency
        const amount = parseFloat(transaction.amount).toFixed(2);
        const currency = transaction.currency || 'PKR';
        
        let body;
        
        // Check if this is a transfer between two different users
        if (transaction.sender_id && transaction.receiver_id && 
            transaction.sender_id !== transaction.receiver_id && 
            senderName && receiverName) {
            // Determine if user sent or received
            const isSender = transaction.sender_id === userId;
            const otherUserName = isSender ? receiverName : senderName;
            const action = isSender ? 'sent' : 'received';
            body = `${otherUserName} ${action} Rs ${amount}`;
        } else {
            // For top-ups, withdrawals, or transactions without sender/receiver info
            // Use the original format
            body = `Your ${transaction.transaction_type} of ${currency} ${amount} is ${transaction.status}`;
        }
        
        const notification = {
            title: 'Transaction Update',
            body: body,
            data: {
                type: 'transaction',
                transactionId: transaction.id,
                transactionRef: transaction.transaction_ref,
                status: transaction.status,
                amount: amount,
                currency: currency,
            },
        };

        return this.sendPushNotification(userId, notification);
    }

    /**
     * Send wallet update notification
     */
    async sendWalletNotification(userId, message, data = {}) {
        const notification = {
            title: 'Wallet Update',
            body: message,
            data: {
                type: 'wallet',
                ...data,
            },
        };

        return this.sendPushNotification(userId, notification);
    }
}

module.exports = new FirebaseService();
