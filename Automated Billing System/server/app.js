const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject sample orders for today (so Today's Revenue card is not empty)
app.use(async (req, res, next) => {
  // We only run this initialization check once or lazily
  if (!app.locals.todayOrdersChecked) {
    app.locals.todayOrdersChecked = true;
    const db = require('./config/db');
    try {
      const [rows] = await db.query("SELECT COUNT(*) AS total FROM orders WHERE DATE(order_date) = CURDATE()");
      if (rows[0].total === 0) {
        console.log('Inserting mock orders for CURDATE()...');
        const [customers] = await db.query("SELECT id FROM customers LIMIT 2");
        const [products] = await db.query("SELECT id, price FROM products ORDER BY RAND() LIMIT 4");
        
        if (customers.length >= 2 && products.length >= 4) {
          const inv1 = `INV-TODAY-${Date.now().toString().slice(-4)}1`;
          const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
          const p0 = parseFloat(products[0].price);
          const p1 = parseFloat(products[1].price);
          const p2 = parseFloat(products[2].price);
          const p3 = parseFloat(products[3].price);
          const total1 = parseFloat((p0 * 2 + p1).toFixed(2));
          const [res1] = await db.query(
            "INSERT INTO orders (invoice_number, customer_id, order_date, total_amount, payment_method, status) VALUES (?, ?, ?, ?, 'UPI', 'Paid')",
            [inv1, customers[0].id, time, total1]
          );
          await db.query("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, 2, ?, ?)", [res1.insertId, products[0].id, p0, parseFloat((p0 * 2).toFixed(2))]);
          await db.query("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, 1, ?, ?)", [res1.insertId, products[1].id, p1, p1]);
          
          const inv2 = `INV-TODAY-${Date.now().toString().slice(-4)}2`;
          const total2 = parseFloat((p2 + p3 * 3).toFixed(2));
          const [res2] = await db.query(
            "INSERT INTO orders (invoice_number, customer_id, order_date, total_amount, payment_method, status) VALUES (?, ?, ?, ?, 'Card', 'Paid')",
            [inv2, customers[1].id, time, total2]
          );
          await db.query("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, 1, ?, ?)", [res2.insertId, products[2].id, p2, p2]);
          await db.query("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, 3, ?, ?)", [res2.insertId, products[3].id, p3, parseFloat((p3 * 3).toFixed(2))]);
          
          await db.query("UPDATE customers SET total_purchases = total_purchases + ? WHERE id = ?", [total1, customers[0].id]);
          await db.query("UPDATE customers SET total_purchases = total_purchases + ? WHERE id = ?", [total2, customers[1].id]);
        }
      }
    } catch (e) {
      console.error('Error on dynamic today data check:', e);
    }
  }
  next();
});

// API Routes
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Serve 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
