const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const winston = require('winston');
const { initDb } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Initialize database
async function startServer() {
    try {
        await initDb();
        logger.info('Database initialized');
    } catch (err) {
        logger.error('Database initialization failed:', err);
    }

    // Check for required environment variables
    if (!process.env.JWT_SECRET) {
        logger.warn('JWT_SECRET not set, using default for development');
        process.env.JWT_SECRET = 'dev-secret-key-change-in-production';
    }

    // Routes
    const authRoutes = require('./routes/authRoutes');
    const transactionRoutes = require('./routes/transactionRoutes');
    const advisoryRoutes = require('./routes/advisoryRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/advisory', advisoryRoutes);

    // Basic Route
    app.get('/', (req, res) => {
        res.json({ message: 'Expenses Tracker API is running' });
    });

    // Start Server
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}

startServer();
