const DashboardModel = require('../models/dashboardModel');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await DashboardModel.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.getRevenue = async (req, res, next) => {
  try {
    const revenue = await DashboardModel.getMonthlyRevenue();
    res.status(200).json({
      success: true,
      data: revenue
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategorySales = async (req, res, next) => {
  try {
    const categorySales = await DashboardModel.getCategorySales();
    res.status(200).json({
      success: true,
      data: categorySales
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyOrders = async (req, res, next) => {
  try {
    const monthlyOrders = await DashboardModel.getMonthlyOrders();
    res.status(200).json({
      success: true,
      data: monthlyOrders
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { search, sortField, sortOrder, limit, page } = req.query;
    const result = await DashboardModel.getOrders({
      search,
      sortField,
      sortOrder,
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1
    });
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getLowStock = async (req, res, next) => {
  try {
    const lowStock = await DashboardModel.getLowStock();
    res.status(200).json({
      success: true,
      data: lowStock
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await DashboardModel.getCustomers();
    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await DashboardModel.getNotifications();
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};
