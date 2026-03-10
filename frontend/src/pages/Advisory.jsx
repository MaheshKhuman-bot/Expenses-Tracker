import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../api';
import { formatMoney, getStoredCurrency } from '../utils/currency';
import './Advisory.css';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const Advisory = () => {
    const [advisory, setAdvisory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(getStoredCurrency());

    useEffect(() => { fetchAdvisory(); }, []);

    const fetchAdvisory = async () => {
        try {
            const res = await api.get('/advisory');
            setAdvisory(res.data);
            if (res.data?.summary?.currency) setCurrency(res.data.summary.currency);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Analyzing your finances…</div>;
    if (!advisory) return <div className="loading">No data yet. Add some transactions!</div>;

    const { summary, status, tips, categoryBreakdown } = advisory;

    const isGood = status.toLowerCase().includes('good');
    const isCritical = status.toLowerCase().includes('critical');
    const badgeClass = isGood ? 'good' : isCritical ? 'critical' : 'warning';

    const fmt = (v) => formatMoney(v, currency);

    return (
        <div className="advisory-page">
            <div className="page-header">
                <h1>Financial Insights</h1>
                <p>Smart analysis of your spending habits.</p>
            </div>

            <div className="advisory-grid">
                {/* Status + Budget */}
                <div className="advisory-card">
                    <div className="status-header">
                        <h3>Budget Status</h3>
                        <span className={`status-badge ${badgeClass}`}>
                            {isGood ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                            {status}
                        </span>
                    </div>

                    <div className="budget-label-row">
                        <span>Budget Used</span>
                        <span>{summary.budgetUsedPercent.toFixed(1)}%</span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${Math.min(summary.budgetUsedPercent, 100)}%`,
                                background: isCritical
                                    ? 'var(--danger)'
                                    : summary.budgetUsedPercent > 70
                                        ? 'var(--warning)'
                                        : 'var(--accent-primary)',
                            }}
                        />
                    </div>
                    <p className="budget-sub">
                        {fmt(summary.totalExpenses)} spent of {fmt(summary.budget)} budget
                    </p>

                    <div className="summary-metrics">
                        <div className="metric-item">
                            <span className="m-label">Total Income</span>
                            <span className="m-value success">{fmt(summary.totalIncome)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="m-label">Total Expenses</span>
                            <span className="m-value danger">{fmt(summary.totalExpenses)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="m-label">Net Balance</span>
                            <span className={`m-value ${summary.balance >= 0 ? 'success' : 'danger'}`}>
                                {fmt(summary.balance)}
                            </span>
                        </div>
                        <div className="metric-item">
                            <span className="m-label">Budget Left</span>
                            <span className="m-value">
                                {fmt(Math.max(summary.budget - summary.totalExpenses, 0))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="advisory-card tips-card">
                    <p className="card-section-title">💡 Personalized Tips</p>
                    <div className="tips-list">
                        {tips.length === 0 ? (
                            <p className="no-tips">No tips yet — keep adding transactions!</p>
                        ) : (
                            tips.map((tip, i) => (
                                <div key={i} className="tip-item">
                                    <Lightbulb className="tip-icon" size={18} />
                                    <p>{tip}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chart */}
                <div className="advisory-card chart-card">
                    <p className="card-section-title">📊 Spending by Category</p>
                    {categoryBreakdown.length === 0 ? (
                        <p className="no-tips">No expense data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="amount"
                                    nameKey="category"
                                >
                                    {categoryBreakdown.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(v) => [fmt(v), 'Spent']}
                                    contentStyle={{
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'white',
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(v) => (
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{v}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Advisory;
