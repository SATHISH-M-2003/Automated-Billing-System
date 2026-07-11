const fs = require('fs');
const path = require('path');

// Target file
const sqlFilePath = 'C:\\Users\\sathi\\Pictures\\Intern projects\\Automated Billing System\\database\\billing.sql';
const dir = path.dirname(sqlFilePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

let sqlContent = `-- Automated Billing System Schema & Seed Data
CREATE DATABASE IF NOT EXISTS billing_db;
USE billing_db;

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS notifications;

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    min_stock_level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Customers Table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    total_purchases DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

// 1. Categories
const categories = [
    { name: 'Electronics', desc: 'Gadgets, appliances, and accessories' },
    { name: 'Groceries', desc: 'Daily essentials, fresh food, and households' },
    { name: 'Pharmacy', desc: 'Medicines, supplements, and wellness' },
    { name: 'Clothing', desc: 'Apparel, footwear, and accessories' },
    { name: 'Stationery', desc: 'Books, notebooks, and writing materials' }
];

sqlContent += `-- Insert Categories\n`;
categories.forEach(cat => {
    sqlContent += `INSERT INTO categories (name, description) VALUES ('${cat.name}', '${cat.desc}');\n`;
});
sqlContent += `\n`;

// Helper data for products
const tempProducts = {
    'Electronics': [
        { name: 'Dell XPS 15 Laptop', priceRange: [1200, 1600] },
        { name: 'iPhone 15 Pro', priceRange: [999, 1200] },
        { name: 'Samsung Galaxy S24 Ultra', priceRange: [1100, 1300] },
        { name: 'Sony WH-1000XM5 Headphones', priceRange: [300, 399] },
        { name: 'Logitech MX Keys Keyboard', priceRange: [99, 149] },
        { name: 'Logitech MX Master 3S Mouse', priceRange: [89, 109] },
        { name: 'iPad Pro 11"', priceRange: [799, 999] },
        { name: 'Anker USB-C Fast Charger 65W', priceRange: [29, 49] },
        { name: 'JBL Flip 6 Bluetooth Speaker', priceRange: [99, 129] },
        { name: 'LG 27" UltraGear Monitor', priceRange: [249, 399] },
        { name: 'Seagate 2TB External HDD', priceRange: [59, 89] },
        { name: 'Apple Watch Series 9', priceRange: [399, 499] },
        { name: 'SanDisk 128GB USB Flash Drive', priceRange: [15, 25] },
        { name: 'GoPro HERO12 Black', priceRange: [349, 399] },
        { name: 'TP-Link WiFi 6 Router', priceRange: [79, 129] },
        { name: 'Kindle Paperwhite', priceRange: [139, 189] },
        { name: 'HP LaserJet Pro Printer', priceRange: [189, 249] },
        { name: 'Bose SoundLink Flex', priceRange: [129, 149] },
        { name: 'HyperX Cloud II Gaming Headset', priceRange: [79, 99] },
        { name: 'Razer DeathAdder Mouse', priceRange: [49, 69] }
    ],
    'Groceries': [
        { name: 'Organic Almond Milk 1L', priceRange: [3.5, 5.5] },
        { name: 'Brown Bread Whole Wheat', priceRange: [2.0, 3.5] },
        { name: 'Free Range Eggs 12pk', priceRange: [4.0, 6.0] },
        { name: 'Salted Butter 250g', priceRange: [3.0, 4.5] },
        { name: 'Basmati Rice 5kg', priceRange: [12.0, 18.0] },
        { name: 'Extra Virgin Olive Oil 500ml', priceRange: [8.0, 14.5] },
        { name: 'Premium Ground Coffee 500g', priceRange: [9.0, 15.0] },
        { name: 'Green Tea 50 Tea Bags', priceRange: [4.5, 7.0] },
        { name: 'Organic Honey 500g', priceRange: [6.0, 10.0] },
        { name: 'Oatmeal Porridge 1kg', priceRange: [3.5, 5.0] },
        { name: 'Pasta Spaghetti 500g', priceRange: [1.5, 2.8] },
        { name: 'Tomato Ketchup 500g', priceRange: [2.5, 4.0] },
        { name: 'Dark Chocolate Bar 100g', priceRange: [2.5, 5.0] },
        { name: 'Mixed Nuts Bag 400g', priceRange: [8.0, 12.0] },
        { name: 'All Purpose Flour 2kg', priceRange: [2.5, 4.0] },
        { name: 'Refined Sugar 1kg', priceRange: [1.5, 2.5] },
        { name: 'Peanut Butter 340g', priceRange: [3.5, 6.0] },
        { name: 'Corn Flakes Cereal 500g', priceRange: [3.0, 5.0] },
        { name: 'Canned Tuna 3pk', priceRange: [4.5, 7.0] },
        { name: 'Dishwasher Pods 30pk', priceRange: [10.0, 15.0] }
    ],
    'Pharmacy': [
        { name: 'Paracetamol 500mg (100 tabs)', priceRange: [5.0, 8.0] },
        { name: 'Ibuprofen 200mg (50 tabs)', priceRange: [6.0, 10.0] },
        { name: 'Vitamin C 1000mg (60 chewables)', priceRange: [12.0, 18.0] },
        { name: 'Multivitamins for Adults (90 count)', priceRange: [18.0, 28.0] },
        { name: 'Non-Drowsy Allergy Relief (30 tabs)', priceRange: [15.0, 22.0] },
        { name: 'Cough & Cold Syrup 200ml', priceRange: [8.0, 12.5] },
        { name: 'Antiseptic Bandages (50 assorted)', priceRange: [4.0, 7.0] },
        { name: 'Hand Sanitizer Gel 500ml', priceRange: [3.5, 6.0] },
        { name: 'Digital Medical Thermometer', priceRange: [15.0, 25.0] },
        { name: 'Medical Face Masks (50 count)', priceRange: [10.0, 15.0] },
        { name: 'Antacid Liquid 350ml', priceRange: [7.0, 11.0] },
        { name: 'Fish Oil Omega-3 (120 softgels)', priceRange: [15.0, 25.0] },
        { name: 'Nasal Decongestant Spray 15ml', priceRange: [6.5, 9.5] },
        { name: 'Pain Relief Cream 100g', priceRange: [8.5, 14.0] },
        { name: 'Eye Drops Soothing 15ml', priceRange: [7.0, 11.5] },
        { name: 'Calcium + Vitamin D3 (100 tabs)', priceRange: [10.0, 16.0] },
        { name: 'First Aid Kit Pocket Size', priceRange: [12.0, 20.0] },
        { name: 'Moisturizing Sunscreen SPF 50', priceRange: [14.0, 24.0] },
        { name: 'Electrolyte Hydration Powder (10pk)', priceRange: [9.0, 15.0] },
        { name: 'Throat Lozenges Honey Lemon (24pk)', priceRange: [4.0, 6.5] }
    ],
    'Clothing': [
        { name: 'Men Crewneck T-Shirt Plain', priceRange: [15.0, 25.0] },
        { name: 'Women Skinny Fit Jeans', priceRange: [35.0, 55.0] },
        { name: 'Men Slim Fit Denim Jeans', priceRange: [35.0, 60.0] },
        { name: 'Unisex Fleece Hoodie', priceRange: [40.0, 65.0] },
        { name: 'Running Sneakers Air Cushioned', priceRange: [65.0, 110.0] },
        { name: 'Water-Resistant Windbreaker Jacket', priceRange: [50.0, 90.0] },
        { name: 'Athletic Casual Shorts', priceRange: [20.0, 35.0] },
        { name: 'Leather Belt Classic Buckle', priceRange: [25.0, 45.0] },
        { name: 'Cotton Socks Set (5 pairs)', priceRange: [10.0, 18.0] },
        { name: 'Baseball Cap Adjustable', priceRange: [12.0, 22.0] },
        { name: 'Women Summer Maxi Dress', priceRange: [40.0, 75.0] },
        { name: 'Men Polo Shirt Classic', priceRange: [22.0, 38.0] },
        { name: 'Activewear Yoga Pants', priceRange: [28.0, 48.0] },
        { name: 'Knitted Woolen Sweater', priceRange: [45.0, 80.0] },
        { name: 'Formal Dress Shirt Slim Fit', priceRange: [28.0, 45.0] },
        { name: 'Canvas Slip-on Shoes', priceRange: [35.0, 55.0] },
        { name: 'Pajama Sleepwear Set', priceRange: [25.0, 45.0] },
        { name: 'Swim Shorts Quick Dry', priceRange: [18.0, 30.0] },
        { name: 'Winter Knitted Beanie', priceRange: [10.0, 18.0] },
        { name: 'Silk Necktie Formal', priceRange: [15.0, 30.0] }
    ],
    'Stationery': [
        { name: 'A4 Copier Paper Ream (500 pages)', priceRange: [6.0, 10.0] },
        { name: 'Executive Hardcover Journal', priceRange: [10.0, 18.0] },
        { name: 'Retractable Gel Pens (12 pack)', priceRange: [8.0, 15.0] },
        { name: 'Wooden Pencils HB (30 pack)', priceRange: [4.0, 8.0] },
        { name: 'Highlighters Pastel Colors (6 pack)', priceRange: [5.0, 9.0] },
        { name: 'Durable D-Ring Binder 2"', priceRange: [4.5, 8.5] },
        { name: 'Stainless Steel Scissors 8"', priceRange: [3.5, 7.0] },
        { name: 'Permanent Markers Double-Ended (4 pack)', priceRange: [5.5, 9.5] },
        { name: 'Heavy Duty Desktop Stapler', priceRange: [12.0, 20.0] },
        { name: 'Staple Pins (5000 count box)', priceRange: [1.5, 3.0] },
        { name: 'Sticky Notes Notes 3x3 (12 pads)', priceRange: [8.0, 14.0] },
        { name: 'Mini Paper Clips (100 count)', priceRange: [1.0, 2.5] },
        { name: 'Correction Tape (4 pack)', priceRange: [4.0, 8.0] },
        { name: 'Drawing Sketchbook 100pgs', priceRange: [8.0, 15.0] },
        { name: 'Plastic Ruler 30cm', priceRange: [1.0, 2.0] },
        { name: 'Glue Sticks Combo (4 pack)', priceRange: [3.5, 6.0] },
        { name: 'Dry Erase Markers Black (12 pack)', priceRange: [10.0, 18.0] },
        { name: 'Calculator Scientific 240 Functions', priceRange: [15.0, 25.0] },
        { name: 'Desk Organizer Mesh Steel', priceRange: [12.0, 22.0] },
        { name: 'Notebook Spiral Bound A5 (5 pack)', priceRange: [8.0, 14.0] }
    ]
};

// Generate Exactly 100 products (20 per category)
sqlContent += `-- Insert Products (Exactly 100)\n`;
let currentProductId = 1;
const productList = []; // Array to store generated product data
let catId = 1;

for (const catName in tempProducts) {
    const items = tempProducts[catName];
    items.forEach(item => {
        const price = (Math.random() * (item.priceRange[1] - item.priceRange[0]) + item.priceRange[0]).toFixed(2);
        // Make some stock low (less than min_stock_level) for testing the Low Stock table
        const minStock = Math.floor(Math.random() * 15) + 5; // Min stock: 5 to 20
        // 15% probability of being low stock
        const isLow = Math.random() < 0.15;
        const stock = isLow ? Math.floor(Math.random() * minStock) : Math.floor(Math.random() * 80) + minStock;
        
        sqlContent += `INSERT INTO products (id, name, category_id, price, stock_quantity, min_stock_level) VALUES (${currentProductId}, '${item.name.replace(/'/g, "''")}', ${catId}, ${price}, ${stock}, ${minStock});\n`;
        productList.push({
            id: currentProductId,
            name: item.name,
            categoryId: catId,
            price: parseFloat(price),
            stock: stock,
            minStock: minStock
        });
        currentProductId++;
    });
    catId++;
}
sqlContent += `\n`;

// 3. Customers (Exactly 50)
const customerNames = [
    'Aarav Sharma', 'Sanya Patel', 'Aditya Verma', 'Diya Iyer', 'Rohan Gupta',
    'Ananya Rao', 'Vihaan Malhotra', 'Ishita Joshi', 'Arjun Singhal', 'Meera Nair',
    'Kabir Kapoor', 'Avani Sen', 'Sai Reddy', 'Kavya Choudhury', 'Rudra Banerjee',
    'Anika Deshmukh', 'Reyansh Saxena', 'Zara Khan', 'Vivaan Sethi', 'Kiara Bhat',
    'John Doe', 'Jane Smith', 'David Miller', 'Sarah Connor', 'Michael Scott',
    'Emma Watson', 'James Bond', 'Olivia Taylor', 'William Davis', 'Sophia Martinez',
    'Sathish Kumar', 'Vasanth Raveendran', 'Arun Prasath', 'Divya Balaji', 'Deepak Chandran',
    'Subhashini Ram', 'Priya Mani', 'Karthik Raja', 'Manoj Kumar', 'Ganesh Moorthy',
    'Sundar Pichai', 'Satya Nadella', 'Nandan Nilekani', 'Azim Premji', 'Kiran Mazumdar',
    'Falguni Nayar', 'Roshni Nadar', 'Radhika Gupta', 'Vani Kola', 'Anjali Sud'
];

const phonePrefixes = ['9840', '9884', '9444', '8122', '7358', '9940', '9003', '9600', '8939', '7200'];
const providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.in'];
const cities = ['Chennai', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Kolkata', 'Pune', 'Coimbatore'];

sqlContent += `-- Insert Customers (Exactly 50)\n`;
const generatedCustomers = [];
for (let id = 1; id <= 50; id++) {
    const name = customerNames[id - 1];
    const emailName = name.toLowerCase().replace(/ /g, '.');
    const email = `${emailName}@${providers[Math.floor(Math.random() * providers.length)]}`;
    const phone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${Math.floor(Math.random() * 900000) + 100000}`;
    const address = `${Math.floor(Math.random() * 100) + 1}, Cross Street, ${cities[Math.floor(Math.random() * cities.length)]}`;
    sqlContent += `INSERT INTO customers (id, name, phone, email, address, total_purchases) VALUES (${id}, '${name}', '${phone}', '${email}', '${address}', 0.00);\n`;
    generatedCustomers.push({ id, name, phone, email, address, totalPurchases: 0 });
}
sqlContent += `\n`;

// 4. Generate Orders (Exactly 300)
// To spread them over the year January to December 2026 or last 12 months. Let's make it spread from Jul 2025 to Jul 2026.
const startTimestamp = new Date('2025-07-20T00:00:00Z').getTime();
const endTimestamp = new Date('2026-07-10T12:00:00Z').getTime();

const paymentMethods = ['Cash', 'Card', 'UPI', 'Net Banking'];
const statuses = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Cancelled']; // 4/6 Paid (~67%), 1/6 Pending (~17%), 1/6 Cancelled (~17%)

sqlContent += `-- Insert Orders & Order Items (Exactly 300 orders, ~500 items)\n`;

// To ensure exactly 500 order items across 300 orders, we can distribute:
// For order i (1 to 300):
// We need exactly 500 items in total.
// So we can do:
// First 200 orders: 1 item each (200 items)
// Next 100 orders: 3 items each (300 items)
// Total items = 500!
// This satisfies "300 orders, 500 order items" mathematically!
// Let's shuffle the order of sizes or just assign them as we go.
// Let's create an array of number of items per order, then mix it up.
const itemCounts = [];
for (let i = 0; i < 200; i++) itemCounts.push(1);
for (let i = 0; i < 100; i++) itemCounts.push(3);

// Let's shuffle itemCounts a bit to make it feel natural
for (let i = itemCounts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemCounts[i], itemCounts[j]] = [itemCounts[j], itemCounts[i]];
}

const customerPurchases = {}; // To compute total_purchases per customer
generatedCustomers.forEach(c => { customerPurchases[c.id] = 0; });

let orderItemCount = 1;

for (let orderId = 1; orderId <= 300; orderId++) {
    const invoiceNum = `INV-2026-${String(orderId).padStart(4, '0')}`;
    const custId = Math.floor(Math.random() * 50) + 1;
    
    // Choose a random date in the range
    const orderTime = new Date(startTimestamp + Math.random() * (endTimestamp - startTimestamp));
    const year = orderTime.getFullYear();
    const month = String(orderTime.getMonth() + 1).padStart(2, '0');
    const day = String(orderTime.getDate()).padStart(2, '0');
    const hours = String(orderTime.getHours()).padStart(2, '0');
    const minutes = String(orderTime.getMinutes()).padStart(2, '0');
    const datetimeStr = `${year}-${month}-${day} ${hours}:${minutes}:00`;

    const payMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate Order Item details before writing INSERT, to calculate total price
    const numItems = itemCounts[orderId - 1] || 1;
    const itemsData = [];
    let orderTotalAmount = 0;
    
    for (let k = 0; k < numItems; k++) {
        // Choose a random product
        const prod = productList[Math.floor(Math.random() * productList.length)];
        const qty = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
        const itemTotal = prod.price * qty;
        orderTotalAmount += itemTotal;
        itemsData.push({
            prodId: prod.id,
            qty: qty,
            price: prod.price,
            total: itemTotal
        });
    }

    orderTotalAmount = parseFloat(orderTotalAmount.toFixed(2));
    
    // Increment customer purchases (only if order is Paid)
    if (status === 'Paid') {
        customerPurchases[custId] += orderTotalAmount;
    }

    // Insert Order
    sqlContent += `INSERT INTO orders (id, invoice_number, customer_id, order_date, total_amount, payment_method, status) VALUES (${orderId}, '${invoiceNum}', ${custId}, '${datetimeStr}', ${orderTotalAmount}, '${payMethod}', '${status}');\n`;

    // Insert Order Items
    itemsData.forEach(item => {
        sqlContent += `  INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price) VALUES (${orderItemCount}, ${orderId}, ${item.prodId}, ${item.qty}, ${item.price}, ${item.total});\n`;
        orderItemCount++;
    });
}

// Update total_purchases in customers table
sqlContent += `\n-- Update Customer Purchases\n`;
for (let cId = 1; cId <= 50; cId++) {
    const totalPurch = customerPurchases[cId].toFixed(2);
    sqlContent += `UPDATE customers SET total_purchases = ${totalPurch} WHERE id = ${cId};\n`;
}
sqlContent += `\n`;

// 5. Generate Notifications (Exactly 20)
sqlContent += `-- Insert Notifications (Exactly 20)\n`;
const notificationTypes = [
    { type: 'invoice', message: 'Invoice INV-2026-0089 generated successfully.' },
    { type: 'low_stock', message: 'Low stock alert: Asus ROG Laptop is below minimum level.' },
    { type: 'payment', message: 'Payment of $1,420.00 received for Invoice INV-2026-0042.' },
    { type: 'customer', message: 'New customer "Radhika Gupta" registered successfully.' },
    { type: 'low_stock', message: 'Low stock alert: Organic Almond Milk is running low.' },
    { type: 'invoice', message: 'Invoice INV-2026-0156 generated for Kabir Kapoor.' },
    { type: 'payment', message: 'Payment of $450.00 received via UPI.' },
    { type: 'customer', message: 'New customer "Satya Nadella" added to dashboard.' },
    { type: 'low_stock', message: 'Low stock alert: Paracetamol 500mg stock is below 10.' },
    { type: 'invoice', message: 'Invoice INV-2026-0204 generated for Sanya Patel.' },
    { type: 'payment', message: 'Refund processed for Invoice INV-2026-0012 ($85.00).' },
    { type: 'low_stock', message: 'Low stock alert: Retractable Gel Pens (12 pack) is critical.' },
    { type: 'invoice', message: 'Invoice INV-2026-0277 generated for Vasanth Raveendran.' },
    { type: 'payment', message: 'Payment of $50.00 received for INV-2026-0210.' },
    { type: 'customer', message: 'New customer "Falguni Nayar" added.' },
    { type: 'low_stock', message: 'Low stock alert: Leather Belt Classic Buckle is low.' },
    { type: 'invoice', message: 'Invoice INV-2026-0299 generated for Aarav Sharma.' },
    { type: 'payment', message: 'Invoice INV-2026-0288 paid by credit card.' },
    { type: 'low_stock', message: 'Low stock alert: LG 27" UltraGear Monitor has only 2 units left.' },
    { type: 'customer', message: 'New customer "Sundar Pichai" profile created.' }
];

notificationTypes.forEach((n, idx) => {
    // Generate dates during the last month
    const notifTime = new Date(endTimestamp - idx * 1.5 * 60 * 60 * 1000 - Math.random() * 30 * 60 * 1000);
    const year = notifTime.getFullYear();
    const month = String(notifTime.getMonth() + 1).padStart(2, '0');
    const day = String(notifTime.getDate()).padStart(2, '0');
    const hours = String(notifTime.getHours()).padStart(2, '0');
    const minutes = String(notifTime.getMinutes()).padStart(2, '0');
    const datetimeStr = `${year}-${month}-${day} ${hours}:${minutes}:00`;
    const isRead = idx < 12 ? 1 : 0; // some read, some unread
    sqlContent += `INSERT INTO notifications (id, type, message, is_read, created_at) VALUES (${idx + 1}, '${n.type}', '${n.message}', ${isRead}, '${datetimeStr}');\n`;
});

fs.writeFileSync(sqlFilePath, sqlContent);
console.log('SQL Seed file generated successfully at:', sqlFilePath);
console.log(`Total orders generated: 300, Total order items: ${orderItemCount - 1}`);
