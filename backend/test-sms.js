const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_NUMBER;

// Replace with a valid test number if needed, or use a dummy one to see if it authenticates at least
// Ideally, the user should provide a number or we use one from the code if valid
const testToNumber = '+923001234567';

console.log('Testing Twilio SMS...');
console.log(`SID: ${twilioSid ? 'Set' : 'Not Set'}`);
console.log(`Token: ${twilioToken ? 'Set' : 'Not Set'}`);
console.log(`From: ${twilioFrom}`);
console.log(`To: ${testToNumber}`);

if (!twilioSid || !twilioToken || !twilioFrom) {
    console.error('Missing Twilio configuration');
    process.exit(1);
}

try {
    const client = require('twilio')(twilioSid, twilioToken);

    client.messages.create({
        body: 'Test message from InstaPay debug script',
        from: twilioFrom,
        to: testToNumber,
    })
        .then(message => {
            console.log(`✅ Success! Message SID: ${message.sid}`);
        })
        .catch(error => {
            console.error('❌ Failed to send SMS:');
            console.error(error);
        });

} catch (error) {
    console.error('❌ Error initializing Twilio client:');
    console.error(error);
}
