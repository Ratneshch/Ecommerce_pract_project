const db = require("../db");

// Place Order
exports.placeOrder = (req, res) => {
  const { user_id, address, total_amount, items } = req.body;

  if (!user_id || !address || !total_amount || !items || !items.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: err.message });

    // Use user_id as address_id to match the FK
    const orderSql = `INSERT INTO orders (user_id, address_id, total_amount) VALUES (?, ?, ?)`;
    db.query(orderSql, [user_id, user_id, total_amount], (err, orderResult) => {
      if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

      const order_id = orderResult.insertId;

      // Insert order items
      const itemsSql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`;
      const itemsValues = items.map((item) => [order_id, item.product_id, item.quantity, item.price]);

      db.query(itemsSql, [itemsValues], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json({ message: err.message }));

          res.status(200).json({ message: "Order placed successfully", order_id });
        });
      });
    });
  });
};

// Get Order by ID
exports.getOrderById = (req, res) => {
  const { id } = req.params;

  // 1. Get order details
  const orderSql = `SELECT * FROM orders WHERE id = ?`;
  db.query(orderSql, [id], (err, orderResult) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!orderResult.length) return res.status(404).json({ message: "Order not found" });

    const order = orderResult[0];

    // 2. Get order items with product titles
    const itemsSql = `
      SELECT oi.product_id, oi.quantity, oi.price, p.title
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    db.query(itemsSql, [id], (err, itemsResult) => {
      if (err) return res.status(500).json({ message: err.message });

      order.items = itemsResult; // attach items to order
      res.json(order);
    });
  });
};
