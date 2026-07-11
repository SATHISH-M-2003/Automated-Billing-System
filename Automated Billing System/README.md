# Automated Billing System Dashboard

A production-ready **ERP Billing Dashboard** built with React.js (Vite), Express.js, and MySQL.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Material UI, Chart.js, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |

---

## 📁 Project Structure

```
automated-billing-dashboard/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── layouts/          # DashboardLayout (navbar + sidebar)
│       ├── pages/            # Dashboard.jsx, ComingSoon.jsx
│       ├── services/         # api.js - Axios service layer
│       ├── App.jsx           # App root, routing, theme toggle
│       ├── main.jsx          # React entry point
│       ├── index.css         # Global CSS styles
│       └── theme.js          # MUI light/dark theme config
│
├── server/                   # Express backend
│   ├── config/db.js          # MySQL2 connection pool
│   ├── controllers/          # dashboardController.js
│   ├── models/               # dashboardModel.js (all SQL queries)
│   ├── routes/               # dashboardRoutes.js
│   ├── middleware/           # errorHandler.js
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   └── .env                  # Environment variables
│
└── database/
    └── billing.sql           # Full schema + seed data
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js >= 18
- MySQL Server 8.0

### 1. Clone / Download the project

### 2. Import MySQL Database

Open MySQL command line and run:

```bash
mysql -u root -p < database/billing.sql
```

This will create the `billing_db` database with:
- 5 Categories
- 100 Products
- 50 Customers
- 300 Orders
- 500 Order Items
- 20 Notifications

### 3. Configure Backend Environment

Edit `server/.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=billing_db
```

### 4. Start the Backend

```bash
cd server
npm install
npm start
```

Backend runs at: **http://localhost:5000**

### 5. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Stats cards data (revenue, orders, customers etc.) |
| GET | `/api/dashboard/revenue` | Monthly revenue for line chart |
| GET | `/api/dashboard/category-sales` | Sales by category for pie chart |
| GET | `/api/dashboard/monthly-orders` | Monthly orders for bar chart |
| GET | `/api/dashboard/orders` | Orders table (search, sort, paginate) |
| GET | `/api/dashboard/low-stock` | Products below minimum stock |
| GET | `/api/dashboard/customers` | Top purchasing customers |
| GET | `/api/dashboard/notifications` | Latest system notifications |

---

## 🎨 Dashboard Features

- **8 Stats Cards** — Total Revenue, Today's Revenue, Orders, Customers, Products, Low Stock
- **Revenue Line Chart** — Monthly revenue trend (last 12 months)
- **Sales Category Pie Chart** — Electronics, Groceries, Pharmacy, Clothing, Stationery
- **Monthly Orders Bar Chart** — Orders per month
- **Financial Summary** — Revenue, Expenses, Profit, Loss with progress bars
- **Quick Action Panel** — Generate Invoice, Add Product, Add Customer, View Reports
- **Recent Orders Table** — With search, sorting, pagination, and status badges
- **Low Stock Table** — Highlighted alert rows for below-minimum products
- **Top Customers List** — Ranked by total purchase value
- **Notifications Panel** — In navbar with unread badge count
- **Dark Mode Toggle** — Persisted to localStorage
- **Export CSV** — Download monthly revenue report
- **Export PDF** — Print/Export the dashboard view
- **Refresh Button** — Live reload all dashboard data
- **Live Clock** — Real-time date and time display
- **Collapsible Sidebar** — Responsive for mobile and desktop

---

## 📱 Responsive Design

- Mobile-first layout with MUI Grid
- Collapsible/Temporary drawer on mobile
- Persistent collapsible drawer on desktop
- Sticky top navigation bar

---

## 🗄️ Database Schema

| Table | Records |
|---|---|
| categories | 5 |
| products | 100 |
| customers | 50 |
| orders | 300 |
| order_items | 500 |
| notifications | 20 |
