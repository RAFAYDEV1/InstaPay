const { query } = require('./src/config/database');

async function checkTables() {
    try {
        const result = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

        console.log('📊 Database Tables:');
        result.rows.forEach(row => {
            console.log('  ✓', row.table_name);
        });

        console.log('\n✅ Database is connected and working!');
        console.log('All backend services will now read/write data from the database.');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

checkTables();
