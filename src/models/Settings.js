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

const Settings = {
    async findByUserId(userId) {
        const db = await getDb();
        return db.get('SELECT * FROM user_settings WHERE userId = ?', [userId]);
    },

    async update(userId, monthlyBudget, notificationThreshold, currency) {
        const db = await getDb();
        await db.run(
            'UPDATE user_settings SET monthly_budget = ?, notification_threshold = ?, currency = ? WHERE userId = ?',
            [monthlyBudget, notificationThreshold, currency || 'USD', userId]
        );
        return { userId, monthlyBudget, notificationThreshold, currency };
    }
};

module.exports = Settings;
