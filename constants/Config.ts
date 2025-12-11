// API Configuration
export const API_CONFIG = {
    // Change this to your computer's IP address when testing on physical device
    // Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
    BASE_URL: 'http://192.168.18.84:3000/api',

    // For physical device testing, use your computer's IP:
    // BASE_URL: 'http://192.168.x.x:3000/api',

    TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    UPDATE_FCM_TOKEN: '/auth/update-fcm-token',

    // User
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    UPLOAD_PROFILE_IMAGE: '/user/upload-profile-image',
    DELETE_PROFILE_IMAGE: '/user/delete-profile-image',

    // Wallet
    GET_BALANCE: '/wallet/balance',
    WALLET_HISTORY: '/wallet/history',
    BALANCE_HISTORY: '/wallet/balance-history',

    // Transactions
    GET_TRANSACTIONS: '/transactions',
    SEND_MONEY: '/transactions/send',
    REQUEST_MONEY: '/transactions/request',

    // Admin
    TOP_UP: '/admin/top-up',
};
