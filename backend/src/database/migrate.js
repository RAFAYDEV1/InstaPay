const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

// Migration runner
const runMigrations = async () => {
    try {
        console.log('🚀 Starting database migrations...\n');

        const migrationsDir = __dirname + '/migrations';
        const migrationFiles = fs
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort(); // Sort to run in order

        console.log(`Found ${migrationFiles.length} migration files\n`);

        for (const file of migrationFiles) {
            console.log(`Running migration: ${file}`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            try {
                await pool.query(sql);
                console.log(`✅ ${file} completed successfully\n`);
            } catch (error) {
                console.error(`❌ Error running ${file}:`, error.message);
                throw error;
            }
        }

        console.log('✅ All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run migrations
runMigrations();
