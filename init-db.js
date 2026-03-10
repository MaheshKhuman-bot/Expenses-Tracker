const { initDb } = require('./src/config/db');

async function runInit() {
    try {
        await initDb();
        console.log('Database initialization complete.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

runInit();
