const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const twilioVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_FROM_NUMBER'
];

console.log('Checking Twilio Configuration:');
twilioVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
        console.log(`✅ ${varName} is set`);
    } else {
        console.log(`❌ ${varName} is NOT set`);
    }
});
