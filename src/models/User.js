const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || 'database.sqlite');

async function getDb() {
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
}

const User = {
    async create(username, password) {
        const db = await getDb();
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        // Initialize default settings for new user
        await db.run(
            'INSERT INTO user_settings (userId, monthly_budget, notification_threshold, currency) VALUES (?, ?, ?, ?)',
            [result.lastID, 0, 0.8, 'USD']
        );
        return { id: result.lastID, username };
    },

    async findByUsername(username) {
        const db = await getDb();
        return db.get('SELECT * FROM users WHERE username = ?', [username]);
    },

    async findById(id) {
        const db = await getDb();
        return db.get('SELECT * FROM users WHERE id = ?', [id]);
    }
};

module.exports = User;
