import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  TextField,
  TablePagination,
  TableSortLabel,
  Tooltip,
  LinearProgress,
  Stack,
  ButtonBase
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as RevenueIcon,
  ArrowForward as ArrowIcon,
  Search as SearchIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CompletedIcon,
  HourglassEmpty as PendingIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { dashboardService } from '../services/api';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const Dashboard = ({ onRefreshNotifications }) => {
  const navigate = useNavigate();

  // Component states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard pieces
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  // Orders Table options
  const [orders, setOrders] = useState([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('order_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load all dashboard sections
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        statsRes,
        revenueRes,
        categoryRes,
        monthlyOrdersRes,
        lowStockRes,
        customersRes
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenue(),
        dashboardService.getCategorySales(),
        dashboardService.getMonthlyOrders(),
        dashboardService.getLowStock(),
        dashboardService.getCustomers()
      ]);

      setStats(statsRes.data);
      setMonthlyRevenue(revenueRes.data);
      setCategorySales(categoryRes.data);
      setMonthlyOrders(monthlyOrdersRes.data);
      setLowStock(lowStockRes.data);
      setRecentCustomers(customersRes.data);
      
      // Load current page orders
      await fetchOrders({
        page: page + 1,
        limit: rowsPerPage,
        sortField,
        sortOrder,
        search: searchTerm
      });

      // Update navbar notifications concurrently
      if (onRefreshNotifications) {
        onRefreshNotifications();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please verify your MySQL server connection is live.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder, searchTerm, onRefreshNotifications]);

  // Load recent orders segment separately for table pagination/sorting
  const fetchOrders = async (params) => {
    try {
      const ordersRes = await dashboardService.getOrders(params);
      setOrders(ordersRes.orders);
      setOrdersTotal(ordersRes.pagination.total);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Initial trigger
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Search Input in Order Table
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (stats) { // Avoid running on mount before initial load
        setPage(0);
        fetchOrders({
          page: 1,
          limit: rowsPerPage,
          sortField,
          sortOrder,
          search: searchTerm
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    fetchOrders({
      page: newPage + 1,
      limit: rowsPerPage,
      sortField,
      sortOrder,
      search: searchTerm
    });
  };

  const handleRowsPerPageChange = (event) => {
    const limit = parseInt(event.target.value, 10);
    setRowsPerPage(limit);
    setPage(0);
    fetchOrders({
      page: 1,
      limit,
      sortField,
      sortOrder,
      search: searchTerm
    });
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    const order = isAsc ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    
    // Reset page to 0 and retrieve
    setPage(0);
    fetchOrders({
      page: 1,
      limit: rowsPerPage,
      sortField: field,
      sortOrder: order,
      search: searchTerm
    });
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const triggerPrintPdf = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (monthlyRevenue.length === 0) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Month,Revenue\n';
    
    monthlyRevenue.forEach(row => {
      csvContent += `"${row.month_name}",${row.total}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `monthly_revenue_report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="body1" color="text.secondary">Fetching live metrics...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3, mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  // Pre-configured options for charts
  const lineChartData = {
    labels: monthlyRevenue.map(m => m.month_name),
    datasets: [{
      label: 'Monthly Revenue ($)',
      data: monthlyRevenue.map(m => m.total),
      fill: true,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
      tension: 0.35,
      borderWidth: 3,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverRadius: 6
    }]
  };

  const pieChartData = {
    labels: categorySales.map(c => c.category),
    datasets: [{
      data: categorySales.map(c => c.total_sales),
      backgroundColor: ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const barChartData = {
    labels: monthlyOrders.map(m => m.month_name),
    datasets: [{
      label: 'Orders Count',
      data: monthlyOrders.map(m => m.total_orders),
      backgroundColor: 'rgba(6, 182, 212, 0.85)',
      borderRadius: 6,
      barThickness: 18
    }]
  };

  // Helper stats arrays
  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.cards.totalRevenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: stats.cards.totalRevenue.growth,
      icon: <RevenueIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      textColor: '#ffffff'
    },
    {
      title: "Today's Revenue",
      value: `$${stats.cards.todayRevenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: stats.cards.todayRevenue.growth,
      icon: <TodayIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
      textColor: '#ffffff'
    },
    {
      title: 'Total Orders',
      value: stats.cards.totalOrders.value,
      growth: stats.cards.totalOrders.growth,
      icon: <OrdersIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
      textColor: '#ffffff'
    },
    {
      title: 'Completed Orders',
      value: stats.cards.completedOrders.value,
      growth: stats.cards.completedOrders.growth,
      icon: <CompletedIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #0b1f2b 0%, #06b6d4 100%)',
      textColor: '#ffffff'
    },
    {
      title: 'Pending Orders',
      value: stats.cards.pendingOrders.value,
      growth: stats.cards.pendingOrders.growth,
      icon: <PendingIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)',
      textColor: '#ffffff'
    },
    {
      title: 'Total Customers',
      value: stats.cards.totalCustomers.value,
      growth: stats.cards.totalCustomers.growth,
      icon: <CustomersIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #4d1d95 0%, #8b5cf6 100%)',
      textColor: '#ffffff'
    },
    {
      title: 'Total Products',
      value: stats.cards.totalProducts.value,
      growth: stats.cards.totalProducts.growth,
      icon: <CategoryIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
      textColor: '#ffffff'
    },
    {
      title: 'Low Stock Items',
      value: stats.cards.lowStockProducts.value,
      growth: stats.cards.lowStockProducts.growth,
      icon: <WarningIcon fontSize="large" />,
      color: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
      textColor: '#ffffff'
    }
  ];

  const quickActions = [
    { title: 'Generate Invoice', icon: <ReceiptIcon />, path: '/generate-invoice', color: 'primary' },
    { title: 'Add Product', icon: <AddIcon />, path: '/add-product', color: 'secondary' },
    { title: 'Add Customer', icon: <CustomersIcon />, path: '/add-customer', color: 'success' },
    { title: 'View Reports', icon: <InventoryIcon />, path: '/reports', color: 'warning' }
  ];

  return (
    <Box>
      {/* Top Banner Button Bar */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, gap: 2 }} className="no-print">
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.3 }}>
          Dashboard Overview
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
          {/* Refresh button */}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderRadius: 3.5,
              borderColor: 'divider',
              color: 'text.secondary',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'text.secondary'
              }
            }}
          >
            Refresh
          </Button>

          {/* Download CSV button */}
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
            sx={{
              borderRadius: 3.5,
              borderColor: 'divider',
              color: 'text.secondary',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'text.secondary'
              }
            }}
          >
            Export CSV
          </Button>

          {/* Export PDF Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<PdfIcon />}
            onClick={triggerPrintPdf}
            sx={{ borderRadius: 3.5, px: 2.5 }}
          >
            Export PDF
          </Button>
        </Stack>
      </Box>

      {/* Grid containing Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statsCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              className="hover-grow"
              sx={{
                background: card.color,
                color: card.textColor,
                minHeight: 140,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4
              }}
            >
              {/* Overlay translucent icon background */}
              <Box
                sx={{
                  position: 'absolute',
                  right: -10,
                  bottom: -10,
                  opacity: 0.18,
                  transform: 'scale(1.4)',
                  color: '#ffffff'
                }}
              >
                {card.icon}
              </Box>

              <CardContent sx={{ height: '100%', boxSizing: 'border-box', p: 2.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 600 }}>
                  {card.title}
                </Typography>
                
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1.5, mb: 1, letterSpacing: -0.5 }}>
                  {card.value}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {card.growth >= 0 ? (
                    <TrendingUpIcon fontSize="small" sx={{ color: '#4ade80' }} />
                  ) : (
                    <TrendingDownIcon fontSize="small" sx={{ color: '#f87171' }} />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: card.growth >= 0 ? '#4ade80' : '#f87171' }}>
                    {card.growth >= 0 ? `+${card.growth}%` : `${card.growth}%`}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.72rem', ml: 0.5 }}>
                    vs last month
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Expense Summary & Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Expense widget */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Financial Summary
              </Typography>
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
                    Revenue
                  </Typography>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 800, mt: 1 }}>
                    ${stats.expenseSummary.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                  <LinearProgress variant="determinate" value={100} color="success" sx={{ mt: 1.5, height: 4, borderRadius: 2 }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
                    Expenses
                  </Typography>
                  <Typography variant="h5" color="error.main" sx={{ fontWeight: 800, mt: 1 }}>
                    ${stats.expenseSummary.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.round((stats.expenseSummary.expenses / stats.expenseSummary.revenue) * 100) || 0}
                    color="error"
                    sx={{ mt: 1.5, height: 4, borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
                    Profit
                  </Typography>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800, mt: 1 }}>
                    ${stats.expenseSummary.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.round((stats.expenseSummary.profit / stats.expenseSummary.revenue) * 100) || 0}
                    color="primary"
                    sx={{ mt: 1.5, height: 4, borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
                    Loss / Cancels
                  </Typography>
                  <Typography variant="h5" color="warning.main" sx={{ fontWeight: 800, mt: 1 }}>
                    ${stats.expenseSummary.loss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.round((stats.expenseSummary.loss / stats.expenseSummary.revenue) * 100)) || 0}
                    color="warning"
                    sx={{ mt: 1.5, height: 4, borderRadius: 2 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick action buttons */}
        <Grid item xs={12} md={5} className="no-print">
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Action Panel
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <ButtonBase
                      onClick={() => navigate(action.path)}
                      sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          borderColor: `${action.color}.main`,
                          backgroundColor: 'rgba(37,99,235,0.02)'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${action.color}.light`,
                          color: `${action.color}.contrastText`,
                          width: 44,
                          height: 44
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {action.title}
                      </Typography>
                    </ButtonBase>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Line Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Revenue Line Chart
              </Typography>
              <Box sx={{ height: 320, position: 'relative' }}>
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { font: { family: 'Inter' } }
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter' } }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Sales Category
              </Typography>
              <Box sx={{ height: 260, position: 'relative', mt: 'auto', mb: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {categorySales.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No category data</Typography>
                ) : (
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { boxWidth: 12, font: { family: 'Inter', size: 10 } }
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar Chart Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Monthly Orders Bar Chart
              </Typography>
              <Box sx={{ height: 280, position: 'relative' }}>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { font: { family: 'Inter' } }
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Inter' } }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders table */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Orders
                </Typography>
                <TextField
                  placeholder="Search orders..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ width: { xs: '100%', sm: 260 }, mt: { xs: 1.5, sm: 0 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'invoice_number'}
                          direction={sortField === 'invoice_number' ? sortOrder : 'asc'}
                          onClick={() => handleSort('invoice_number')}
                        >
                          Invoice Number
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'customer_name'}
                          direction={sortField === 'customer_name' ? sortOrder : 'asc'}
                          onClick={() => handleSort('customer_name')}
                        >
                          Customer Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'order_date'}
                          direction={sortField === 'order_date' ? sortOrder : 'asc'}
                          onClick={() => handleSort('order_date')}
                        >
                          Order Date
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="right">
                        <TableSortLabel
                          active={sortField === 'total_amount'}
                          direction={sortField === 'total_amount' ? sortOrder : 'asc'}
                          onClick={() => handleSort('total_amount')}
                        >
                          Amount
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortField === 'status'}
                          direction={sortField === 'status' ? sortOrder : 'asc'}
                          onClick={() => handleSort('status')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="center" className="no-print">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                          <Typography variant="body2" color="text.secondary">No matching orders found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell sx={{ fontWeight: 650, color: 'primary.main' }}>
                            {row.invoice_number}
                          </TableCell>
                          <TableCell>{row.customer_name || 'Walk-in Customer'}</TableCell>
                          <TableCell>
                            {new Date(row.order_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ${parseFloat(row.total_amount).toFixed(2)}
                          </TableCell>
                          <TableCell>{row.payment_method}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              color={
                                row.status === 'Paid'
                                  ? 'success'
                                  : row.status === 'Pending'
                                  ? 'warning'
                                  : 'error'
                              }
                              variant={row.status === 'Paid' ? 'filled' : 'outlined'}
                              sx={{ fontWeight: 600, fontSize: '0.72rem', borderRadius: 2 }}
                            />
                          </TableCell>
                          <TableCell align="center" className="no-print">
                            <Button
                              size="small"
                              variant="text"
                              endIcon={<ArrowIcon fontSize="small" />}
                              onClick={() => navigate('/orders-page')}
                              sx={{ py: 0.5, borderRadius: 2 }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={ordersTotal}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Items rows */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Stocks Running Low / Out of Stock
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Current Stock</TableCell>
                      <TableCell align="center">Minimum Level</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStock.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                            ✅ All product stock volumes are within safe parameters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      lowStock.map((row) => (
                        <TableRow key={row.id} sx={{ backgroundColor: row.current_stock === 0 ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{row.product}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, color: row.current_stock === 0 ? 'error.main' : 'warning.main' }}>
                            {row.current_stock}
                          </TableCell>
                          <TableCell align="center">{row.minimum_stock}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.status}
                              size="small"
                              color={row.current_stock === 0 ? 'error' : 'warning'}
                              sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: 1.5 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row containing Recent Customers & Recent Timeline */}
      <Grid container spacing={3}>
        {/* Recent Customers List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Top Purchasing Customers
              </Typography>
              <List sx={{ mt: 1 }}>
                {recentCustomers.map((cust, idx) => (
                  <React.Fragment key={cust.id}>
                    <ListItem
                      alignItems="center"
                      secondaryAction={
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                            ${parseFloat(cust.total_purchases).toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Purchased
                          </Typography>
                        </Box>
                      }
                      sx={{ px: 0, py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 700 }}>
                          {cust.customer_name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={cust.customer_name}
                        secondary={cust.phone_number || 'No Phone'}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                    {idx < recentCustomers.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Coming soon instructions details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ERP Activity & Audit logs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The Automated Billing system tracks and audits all items. Keep the logs updated and perform periodic exports.
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
                <Box sx={{ p: 2, bgcolor: 'action.selected', borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <CompletedIcon color="success" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>System DB Connection Established</Typography>
                    <Typography variant="caption" color="text.secondary">Using root@localhost - Connected to MySQL node successfully</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'action.selected', borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <CompletedIcon color="success" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 650 }}>Express Rest Endpoints Active</Typography>
                    <Typography variant="caption" color="text.secondary">8 separate dashboard feeds pulling real tables dynamically</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
