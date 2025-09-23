const db = require("../db");

// Get user's cart
exports.getUserCart = (req, res) => {
  const userID = req.user.id;

  const sql = `
    SELECT c.product_id, p.title, p.price, c.quantity, 
           (p.price * c.quantity) AS subtotal, p.imgSrc
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?;
  `;

  db.query(sql, [userID], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const totalAmount = results.reduce((sum, item) => sum + Number(item.subtotal), 0);

    res.json({ cart: results, totalAmount });
  });
};

// Add product to cart or increase quantity
exports.addToCart = (req, res) => {
  const { productID, quantity } = req.body;
  const userID = req.user.id;

  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [userID, productID, quantity], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Return updated cart
    db.query(
      `SELECT c.product_id, p.title, p.price, c.quantity, (p.price * c.quantity) AS subtotal, p.imgSrc
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userID],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const totalAmount = results.reduce((sum, item) => sum + Number(item.subtotal), 0);
        res.json({ cart: results, totalAmount });
      }
    );
  });
};

// Update cart quantity
exports.updateQuantity = (req, res) => {
  const { productID, quantity } = req.body;
  const userID = req.user.id;

  if (quantity <= 0) {
    return db.query(
      `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
      [userID, productID],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product removed" });
      }
    );
  }

  db.query(
    `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`,
    [quantity, userID, productID],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        `SELECT c.product_id, p.title, p.price, c.quantity, (p.price * c.quantity) AS subtotal, p.imgSrc
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ?`,
        [userID],
        (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          const totalAmount = results.reduce((sum, item) => sum + Number(item.subtotal), 0);
          res.json({ cart: results, totalAmount });
        }
      );
    }
  );
};

// Remove from cart
exports.removeFromCart = (req, res) => {
  const { productID } = req.params;
  const userID = req.user.id;

  db.query(
    `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
    [userID, productID],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product removed" });
    }
  );
};

// Clear cart
exports.clearCart = (req, res) => {
  const userID = req.user.id;

  db.query(
    `DELETE FROM cart WHERE user_id = ?`,
    [userID],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Cart cleared" });
    }
  );
};
