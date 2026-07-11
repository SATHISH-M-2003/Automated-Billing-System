import axios from 'axios';

const api = axios.create({
  baseURL: '', // Using proxy configuration set up in vite.config.js to handle CORS
  headers: {
    'Content-Type': 'application/json'
  }
});

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },
  getRevenue: async () => {
    const response = await api.get('/api/dashboard/revenue');
    return response.data;
  },
  getCategorySales: async () => {
    const response = await api.get('/api/dashboard/category-sales');
    return response.data;
  },
  getMonthlyOrders: async () => {
    const response = await api.get('/api/dashboard/monthly-orders');
    return response.data;
  },
  getOrders: async (params = {}) => {
    const response = await api.get('/api/dashboard/orders', { params });
    return response.data;
  },
  getLowStock: async () => {
    const response = await api.get('/api/dashboard/low-stock');
    return response.data;
  },
  getCustomers: async () => {
    const response = await api.get('/api/dashboard/customers');
    return response.data;
  },
  getNotifications: async () => {
    const response = await api.get('/api/dashboard/notifications');
    return response.data;
  }
};

export default api;
