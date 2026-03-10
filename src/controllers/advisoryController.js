const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');

exports.getAdvisory = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.findByUserId(userId);
        const settings = await Settings.findByUserId(userId);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const budget = settings?.monthly_budget || 0;
        const threshold = settings?.notification_threshold || 0.8;
        const budgetUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

        let status = 'Good';
        let tips = [];

        if (budget > 0 && totalExpenses > budget) {
            status = 'Critical: Over Budget';
            tips.push('You have exceeded your monthly budget. Consider cutting down on non-essential categories.');
        } else if (budget > 0 && totalExpenses > budget * threshold) {
            status = 'Warning: Approaching Limit';
            tips.push(`You have used ${budgetUsed.toFixed(1)}% of your budget.`);
        }

        if (totalIncome > 0) {
            const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
            tips.push(`Your current savings rate is ${savingsRate.toFixed(1)}%.`);
            if (savingsRate < 20) {
                tips.push('Try to aim for a 20% savings rate by reviewing your frequent expense categories.');
            }
        }

        // Category breakdown
        const categories = [...new Set(transactions.map(t => t.category))];
        const breakdown = categories.map(cat => ({
            category: cat,
            amount: transactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        })).filter(c => c.amount > 0);

        res.json({
            summary: {
                totalExpenses,
                totalIncome,
                balance: totalIncome - totalExpenses,
                budget,
                budgetUsedPercent: budgetUsed,
                currency: settings?.currency || 'USD',
            },
            status,
            tips,
            categoryBreakdown: breakdown
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate advisory', details: err.message });
    }
};

exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findByUserId(req.user.id);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { monthly_budget, notification_threshold, currency } = req.body;
        const settings = await Settings.update(req.user.id, monthly_budget, notification_threshold, currency);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update settings', details: err.message });
    }
};
