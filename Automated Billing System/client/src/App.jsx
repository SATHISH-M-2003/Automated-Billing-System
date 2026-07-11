import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import { dashboardService } from './services/api';

function App() {
  // Read preference from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // State to store notifications
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await dashboardService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  // Sync preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Load notifications initially
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle notification click: mark it as read in memory
  const handleNotificationClick = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, is_read: 1 } : notif
      )
    );
  };

  const activeTheme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Router>
        <DashboardLayout
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        >
          <Routes>
            {/* Primary Dashboard Route */}
            <Route 
              path="/" 
              element={
                <Dashboard onRefreshNotifications={fetchNotifications} />
              } 
            />

            {/* Sidebar Placeholder Routes */}
            <Route path="/products" element={<ComingSoon title="Products" />} />
            <Route path="/customers" element={<ComingSoon title="Customers" />} />
            <Route path="/orders-page" element={<ComingSoon title="Orders" />} />
            <Route path="/inventory" element={<ComingSoon title="Inventory" />} />
            <Route path="/reports" element={<ComingSoon title="Reports" />} />
            <Route path="/settings" element={<ComingSoon title="Settings" />} />

            {/* Quick Actions Placeholder Routes */}
            <Route path="/generate-invoice" element={<ComingSoon title="Generate Invoice" />} />
            <Route path="/add-product" element={<ComingSoon title="Add Product" />} />
            <Route path="/add-customer" element={<ComingSoon title="Add Customer" />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
