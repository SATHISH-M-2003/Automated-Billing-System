const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Define API routes as spec'd
router.get('/stats', dashboardController.getStats);
router.get('/revenue', dashboardController.getRevenue);
router.get('/category-sales', dashboardController.getCategorySales);
router.get('/monthly-orders', dashboardController.getMonthlyOrders);
router.get('/orders', dashboardController.getOrders);
router.get('/low-stock', dashboardController.getLowStock);
router.get('/customers', dashboardController.getCustomers);
router.get('/notifications', dashboardController.getNotifications);

module.exports = router;
