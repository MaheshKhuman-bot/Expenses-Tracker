import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import api from '../api';
import { formatMoney, getStoredCurrency, getCurrencyInfo } from '../utils/currency';
import './Transactions.css';

const emptyForm = { amount: '', category: '', type: 'expense', description: '' };

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const currency = getStoredCurrency();
    const currencyInfo = getCurrencyInfo(currency);

    useEffect(() => { fetchTransactions(); }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', formData);
            setFormData(emptyForm);
            setShowModal(false);
            fetchTransactions();
        } catch {
            alert('Failed to add transaction. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch {
            alert('Failed to delete transaction.');
        }
    };

    if (loading) return <div className="loading">Loading transactions…</div>;

    return (
        <div className="transactions-page">
            <div className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Track every penny of income and spending.</p>
                </div>
                <button className="add-transaction-btn" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Add Transaction
                </button>
            </div>

            {/* —— Modal —— */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <h3>New Transaction</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Amount ({currencyInfo.symbol})</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder={`0.00 ${currencyInfo.code}`}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Food, Salary, Rent…"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Brief note…"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="modal-submit-btn">
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* —— Table —— */}
            <div className="table-card">
                {transactions.length === 0 ? (
                    <div className="table-empty">No transactions yet. Add one above!</div>
                ) : (
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount ({currencyInfo.symbol})</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id}>
                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                    <td>{t.category}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{t.description || '—'}</td>
                                    <td>
                                        <span className={`type-badge ${t.type}`}>
                                            {t.type === 'income'
                                                ? <ArrowUpCircle size={13} />
                                                : <ArrowDownCircle size={13} />}
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className={`amount-cell ${t.type}`}>
                                        {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount, currency)}
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(t.id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Transactions;
