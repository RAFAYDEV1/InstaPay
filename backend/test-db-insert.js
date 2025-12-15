const { query, pool } = require('./src/config/database');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testInsert() {
    console.log('Testing DB Insert...');
    try {
        const phoneNumber = '+923000000000'; // Dummy number
        const otp = '123456';
        const expiryMinutes = 5;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        console.log(`Inserting: ${phoneNumber}, ${otp}, ${expiresAt}`);

        const result = await query(
            `INSERT INTO otp_verifications (phone_number, otp_code, expires_at) 
             VALUES ($1, $2, $3) RETURNING *`,
            [phoneNumber, otp, expiresAt]
        );

        console.log('✅ Insert successful!');
        console.log(result.rows[0]);

    } catch (error) {
        console.error('❌ Insert failed!');
        console.error(error);
    } finally {
        pool.end();
    }
}

testInsert();
