const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || 'database.sqlite');

async function initDb() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    console.log('Database connected.');

    // Create Users table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Create Transactions table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      description TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

    // Create User Settings table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      userId INTEGER PRIMARY KEY,
      monthly_budget REAL DEFAULT 0,
      notification_threshold REAL DEFAULT 0.8,
      currency TEXT DEFAULT 'USD',
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

    // Migrate: add currency column if it doesn't exist (for existing databases)
    try {
        await db.exec(`ALTER TABLE user_settings ADD COLUMN currency TEXT DEFAULT 'USD'`);
    } catch (_) { /* column already exists */ }

    console.log('Tables created successfully.');
    return db;
}

module.exports = { initDb, dbPath };
