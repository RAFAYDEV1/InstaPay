const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

async function checkDb() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully');

        console.log('Checking for otp_verifications table...');
        const res = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'otp_verifications'
            );
        `);

        const exists = res.rows[0].exists;
        console.log(`Table otp_verifications exists: ${exists ? '✅ YES' : '❌ NO'}`);

        if (exists) {
            console.log('Checking table columns...');
            const columns = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'otp_verifications';
            `);
            console.table(columns.rows);
        }

        client.release();
    } catch (err) {
        console.error('❌ Database error:', err);
    } finally {
        await pool.end();
    }
}

checkDb();
