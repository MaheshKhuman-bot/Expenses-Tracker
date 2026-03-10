const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findByUserId(req.user.id);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions', details: err.message });
    }
};

exports.addTransaction = async (req, res) => {
    try {
        const { amount, category, type, description } = req.body;
        if (!amount || !category || !type) {
            return res.status(400).json({ error: 'Amount, category, and type are required' });
        }

        const transaction = await Transaction.create(req.user.id, amount, category, type, description);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add transaction', details: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Transaction.delete(id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Transaction not found or unauthorized' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete transaction', details: err.message });
    }
};
