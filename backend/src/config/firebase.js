const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        // Check if Firebase is already initialized
        if (admin.apps.length > 0) {
            console.log('Firebase already initialized');
            return admin.app();
        }

        // Initialize with service account credentials from environment variables
        const serviceAccount = {
            type: 'service_account',
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
        return admin.app();
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error.message);
        throw error;
    }
};

// Export Firebase services
const getAuth = () => admin.auth();
const getMessaging = () => admin.messaging();
const getFirestore = () => admin.firestore();

module.exports = {
    initializeFirebase,
    admin,
    getAuth,
    getMessaging,
    getFirestore,
};
