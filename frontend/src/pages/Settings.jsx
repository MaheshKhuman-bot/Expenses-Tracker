import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Target, CheckCircle, Globe, Palette, Sun, Moon } from 'lucide-react';
import api from '../api';
import { CURRENCIES, storeCurrency, getStoredCurrency } from '../utils/currency';
import { applyTheme, getStoredTheme } from '../utils/theme';
import './Settings.css';

const Settings = () => {
    const [settings, setSettings] = useState({
        monthly_budget: 0,
        notification_threshold: 0.8,
        currency: 'USD',
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(getStoredTheme());

    const handleThemeSelect = (theme) => {
        applyTheme(theme);
        setCurrentTheme(theme);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/advisory/settings');
            const data = res.data || {};
            setSettings({
                monthly_budget: data.monthly_budget ?? 0,
                notification_threshold: data.notification_threshold ?? 0.8,
                currency: data.currency || getStoredCurrency(),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/advisory/settings', settings);
            storeCurrency(settings.currency);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            alert('Failed to update settings.');
        }
    };

    const handleCurrencyChange = (code) => {
        setSettings((prev) => ({ ...prev, currency: code }));
    };

    if (loading) return <div className="loading">Loading settings…</div>;

    const selectedCurrency = CURRENCIES.find((c) => c.code === settings.currency) || CURRENCIES[0];

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your account and preferences.</p>
            </div>

            <div className="settings-grid">
                {/* Profile */}
                <div className="settings-card">
                    <div className="settings-section-title">
                        <User size={20} />
                        <h3>Profile</h3>
                    </div>
                    <div className="profile-row">
                        <div className="profile-avatar">
                            {user?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p className="profile-name">{user?.username}</p>
                            <p className="profile-id">User ID: #{user?.id}</p>
                        </div>
                    </div>
                </div>

                {/* Appearance / Theme */}
                <div className="settings-card">
                    <div className="settings-section-title">
                        <Palette size={20} />
                        <h3>Appearance</h3>
                    </div>
                    <p className="theme-hint">Choose your preferred theme. Changes apply instantly.</p>
                    <div className="theme-tiles">
                        <button
                            type="button"
                            className={`theme-tile dark-tile ${currentTheme === 'dark' ? 'selected' : ''}`}
                            onClick={() => handleThemeSelect('dark')}
                        >
                            <div className="theme-tile-preview dark-preview">
                                <Moon size={24} />
                            </div>
                            <span className="theme-tile-label">Dark</span>
                            {currentTheme === 'dark' && <span className="theme-active-dot" />}
                        </button>
                        <button
                            type="button"
                            className={`theme-tile light-tile ${currentTheme === 'light' ? 'selected' : ''}`}
                            onClick={() => handleThemeSelect('light')}
                        >
                            <div className="theme-tile-preview light-preview">
                                <Sun size={24} />
                            </div>
                            <span className="theme-tile-label">Light</span>
                            {currentTheme === 'light' && <span className="theme-active-dot" />}
                        </button>
                    </div>
                </div>

                {/* Currency + Budget */}

                <div className="settings-card">
                    <form onSubmit={handleSave}>

                        {/* Currency Selector */}
                        <div className="settings-section-title">
                            <Globe size={20} />
                            <h3>Currency</h3>
                        </div>

                        <div className="currency-preview">
                            <span className="currency-preview-symbol">{selectedCurrency.symbol}</span>
                            <div>
                                <span className="currency-preview-code">{selectedCurrency.code}</span>
                                <span className="currency-preview-name">{selectedCurrency.name}</span>
                            </div>
                        </div>

                        <div className="currency-grid">
                            {CURRENCIES.map((c) => (
                                <button
                                    key={c.code}
                                    type="button"
                                    className={`currency-tile ${settings.currency === c.code ? 'selected' : ''}`}
                                    onClick={() => handleCurrencyChange(c.code)}
                                    title={c.name}
                                >
                                    <span className="currency-tile-symbol">{c.symbol}</span>
                                    <span className="currency-tile-code">{c.code}</span>
                                </button>
                            ))}
                        </div>

                        <hr className="settings-divider" />

                        {/* Budget */}
                        <div className="settings-section-title">
                            <Target size={20} />
                            <h3>Monthly Budget</h3>
                        </div>
                        <div className="settings-form-group">
                            <label>
                                Budget Amount ({selectedCurrency.symbol})
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={settings.monthly_budget}
                                onChange={(e) =>
                                    setSettings({ ...settings, monthly_budget: parseFloat(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <hr className="settings-divider" />

                        {/* Alert Threshold */}
                        <div className="settings-section-title">
                            <Bell size={20} />
                            <h3>Alert Threshold</h3>
                        </div>
                        <div className="settings-form-group">
                            <label>
                                Notify me at{' '}
                                <span className="threshold-val">
                                    {Math.round(settings.notification_threshold * 100)}%
                                </span>{' '}
                                of budget
                            </label>
                            <div className="range-wrapper">
                                <input
                                    type="range"
                                    className="range-slider"
                                    min="0.1"
                                    max="1.0"
                                    step="0.05"
                                    value={settings.notification_threshold}
                                    onChange={(e) =>
                                        setSettings({ ...settings, notification_threshold: parseFloat(e.target.value) })
                                    }
                                />
                                <div className="range-labels">
                                    <span>10%</span>
                                    <span>55%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="save-btn">
                            <Save size={18} />
                            Save Changes
                        </button>

                        {saved && (
                            <div className="success-toast">
                                <CheckCircle size={16} />
                                Settings saved!
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
