const fs = require('fs');
const path = require('path');

// Script to check which environment variables are missing
console.log('🔍 Checking environment variables...\n');

// Load .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Required variables
const requiredVars = {
    'Firebase': [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_CLIENT_ID',
        'FIREBASE_AUTH_URI',
        'FIREBASE_TOKEN_URI',
        'FIREBASE_AUTH_PROVIDER_CERT_URL',
        'FIREBASE_CLIENT_CERT_URL'
    ],
    'Cloudinary': [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'CLOUDINARY_FOLDER'
    ],
    'Supabase': [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
    ],
    'Database': [
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD'
    ],
    'JWT': [
        'JWT_SECRET',
        'JWT_EXPIRES_IN'
    ]
};

let hasErrors = false;
let missingCount = 0;

// Check each category
Object.entries(requiredVars).forEach(([category, vars]) => {
    console.log(`\n📦 ${category} Configuration:`);
    console.log('─'.repeat(50));

    vars.forEach(varName => {
        const value = process.env[varName];
        const isSet = value && value.trim() !== '' && !value.includes('your-');

        if (isSet) {
            // Show first few characters for verification (hide sensitive data)
            const preview = value.length > 20
                ? value.substring(0, 15) + '...'
                : value.substring(0, 10) + '...';
            console.log(`  ✅ ${varName}: ${preview}`);
        } else {
            console.log(`  ❌ ${varName}: NOT SET or using placeholder`);
            hasErrors = true;
            missingCount++;
        }
    });
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
console.log('='.repeat(50));

if (hasErrors) {
    console.log(`\n❌ Found ${missingCount} missing or placeholder variables`);
    console.log('\n📝 Action Required:');
    console.log('   1. Open backend/src/.env file');
    console.log('   2. Replace placeholder values with actual credentials');
    console.log('   3. See QUICK_FIX.md for detailed instructions');
    console.log('   4. Restart the server after updating\n');
    process.exit(1);
} else {
    console.log('\n✅ All required environment variables are set!');
    console.log('   You can now start the server with: npm run dev\n');
    process.exit(0);
}
