const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || 'database.sqlite');

async function getDb() {
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
}

const Transaction = {
    async create(userId, amount, category, type, description) {
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO transactions (userId, amount, category, type, description) VALUES (?, ?, ?, ?, ?)',
            [userId, amount, category, type, description]
        );
        return { id: result.lastID, userId, amount, category, type, description };
    },

    async findByUserId(userId) {
        const db = await getDb();
        return db.all('SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC', [userId]);
    },

    async delete(id, userId) {
        const db = await getDb();
        const result = await db.run('DELETE FROM transactions WHERE id = ? AND userId = ?', [id, userId]);
        return result.changes > 0;
    }
};

module.exports = Transaction;
