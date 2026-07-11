import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ProductsIcon,
  People as CustomersIcon,
  ReceiptLong as OrdersIcon,
  Inventory as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccessTime as ClockIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material';

const DRAWER_WIDTH_OPEN = 260;
const DRAWER_WIDTH_CLOSED = 70;

const DashboardLayout = ({ children, darkMode, setDarkMode, notifications = [], onNotificationClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [dateTime, setDateTime] = useState(new Date());
  
  // Notification menu anchoring
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  const handleProfileOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const formattedDate = dateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <ProductsIcon />, path: '/products' },
    { text: 'Customers', icon: <CustomersIcon />, path: '/customers' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/orders-page' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <Box
        sx={{
          py: 2.5,
          px: sidebarOpen || isMobile ? 3 : 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          height: 64,
          boxSizing: 'border-box',
          justifyContent: sidebarOpen || isMobile ? 'flex-start' : 'center',
          transition: 'all 0.2s',
          backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#2563eb',
          color: '#ffffff'
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: '#2563eb',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}
        >
          A
        </Box>
        {(sidebarOpen || isMobile) && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: 0.5, fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
            AUTO BILLING
          </Typography>
        )}
      </Box>
      <Divider sx={{ opacity: 0.1 }} />

      {/* Menu Options */}
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={!sidebarOpen && !isMobile ? item.text : ''} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen || isMobile ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    backgroundColor: isActive 
                      ? (theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)')
                      : 'transparent',
                    color: isActive 
                      ? 'primary.main' 
                      : 'text.secondary',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.02)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      color: 'text.primary'
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarOpen || isMobile ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'primary.main' : 'inherit',
                      fontSize: '1.25rem'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(sidebarOpen || isMobile) && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem', 
                        fontWeight: isActive ? 600 : 500 
                      }} 
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Footer credits in Sidebar */}
      {(sidebarOpen || isMobile) && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            v1.0.0 • Admin Dashboard
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, px: { xs: 1.5, sm: 3 } }}>
          {/* Logo & Toggle Trigger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleSidebar}
              edge="start"
              sx={{ mr: 1, borderRadius: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Brand Icon / Title */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.95rem', sm: '1.2rem' },
                letterSpacing: -0.2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Enterprise Billing <span style={{ color: theme.palette.primary.main, fontWeight: 800 }}>Dashboard</span>
            </Typography>
          </Box>

          {/* Search Box & Clock & Badges */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Live Clock / Calendar */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.5,
                  px: 2,
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  border: '1px solid rgba(0, 0, 0, 0.02)',
                  fontSize: '0.85rem'
                }}
              >
                <ClockIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {formattedDate}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 16 }} />
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 650, color: 'primary.main' }}>
                  {formattedTime}
                </Typography>
              </Box>
            )}

            {/* Dark Mode toggle button */}
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ borderRadius: 2 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Notification Badge trigger */}
            <IconButton onClick={handleNotifOpen} color="inherit" sx={{ borderRadius: 2 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Profile Avatar */}
            <IconButton onClick={handleProfileOpen} sx={{ p: 0.5 }}>
              <Avatar
                alt="Sathish Kumar"
                src=""
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: 'primary.main',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                SK
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Popover Menu */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={handleNotifClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 450,
            borderRadius: 4,
            mt: 1.5,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notifications</Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }} />
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No new notifications</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
            {notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => {
                  onNotificationClick(notif.id);
                  handleNotifClose();
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: notif.is_read ? 'transparent' : (theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.04)'),
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  whiteSpace: 'normal',
                }}
              >
                {!notif.is_read && (
                  <DotIcon sx={{ color: 'error.main', fontSize: '0.65rem', mt: 0.6 }} />
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: notif.is_read ? 500 : 600 }}>
                    {notif.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>

      {/* Profile menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 200,
            borderRadius: 3
          }
        }}
      >
        <Box sx={{ py: 1, px: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Sathish Kumar</Typography>
          <Typography variant="caption" color="text.secondary">Senior Developer</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }}>Settings</MenuItem>
        <MenuItem onClick={handleProfileClose}>Logout</MenuItem>
      </Menu>

      {/* Sidebar Drawers: Drawer for desktop (persistent/collapsible) and Drawer for mobile (temporary) */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH_OPEN,
              backgroundColor: 'background.default',
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none'
            }
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: 'width 0.2s',
            [`& .MuiDrawer-paper`]: {
              width: sidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
              boxSizing: 'border-box',
              backgroundColor: 'background.default',
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: 'width 0.2s',
              backgroundImage: 'none',
              overflowX: 'hidden'
            },
          }}
        >
          {/* Spacing for Header */}
          <Box sx={{ height: 64 }} />
          {sidebarContent}
        </Drawer>
      )}

      {/* Layout Content wrapper */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          minHeight: '100vh',
          boxSizing: 'border-box',
          width: { md: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED}px)` },
          transition: 'width 0.2s',
          mt: 8 // spacing for sticky top navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
