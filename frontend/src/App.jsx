import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Advisory from './pages/Advisory';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import { applyTheme, getStoredTheme } from './utils/theme';

// Placeholder for other pages
const Placeholder = ({ name }) => (
  <div className="placeholder-content" style={{ padding: '2rem' }}>
    <h1>{name} Page</h1>
    <p>This page is coming soon.</p>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Apply saved theme on every load
  useEffect(() => { applyTheme(getStoredTheme()); }, []);

  const AuthLayout = ({ children }) => (
    <div style={{ display: 'flex', background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, maxHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

        <Route
          path="/"
          element={isAuthenticated ? <AuthLayout><Dashboard /></AuthLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={isAuthenticated ? <AuthLayout><Transactions /></AuthLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/advisory"
          element={isAuthenticated ? <AuthLayout><Advisory /></AuthLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <AuthLayout><Settings /></AuthLayout> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
