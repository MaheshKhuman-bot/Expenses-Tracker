import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import api from '../api';
import { formatMoney, getStoredCurrency } from '../utils/currency';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [currency, setCurrency] = useState(getStoredCurrency());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [advisoryRes, transRes] = await Promise.all([
        api.get('/advisory'),
        api.get('/transactions'),
      ]);
      const sumData = advisoryRes.data.summary || {};
      setSummary(sumData);
      if (sumData.currency) setCurrency(sumData.currency);
      setRecentTransactions((transRes.data || []).slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (amount) => formatMoney(amount, currency);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Welcome Back 👋</h1>
        <p>Here's an overview of your finances.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Balance</span>
            <span className="stat-value">{fmt(summary.balance)}</span>
          </div>
          <div className="stat-icon-wrap balance"><DollarSign size={22} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Income</span>
            <span className="stat-value success">{fmt(summary.totalIncome)}</span>
          </div>
          <div className="stat-icon-wrap income"><ArrowUpCircle size={22} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value danger">{fmt(summary.totalExpenses)}</span>
          </div>
          <div className="stat-icon-wrap expense"><ArrowDownCircle size={22} /></div>
        </div>
      </div>

      <div className="recent-activity-card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
        </div>
        <div className="transaction-list">
          {recentTransactions.length === 0 && (
            <div className="empty-state">No transactions yet. Add one to get started!</div>
          )}
          {recentTransactions.map((t) => (
            <div key={t.id} className="transaction-row">
              <div className={`trans-icon ${t.type}`}>
                {t.type === 'income'
                  ? <ArrowUpCircle size={18} />
                  : <ArrowDownCircle size={18} />}
              </div>
              <div className="trans-details">
                <span className="trans-category">{t.category}</span>
                <span className="trans-date">{new Date(t.date).toLocaleDateString()}</span>
              </div>
              <span className={`trans-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
