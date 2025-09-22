const db = require("../db");

// Add product to cart
exports.addToCart = (req, res) => {
    const { userID, productID, quantity } = req.body;

    const sql = `
      INSERT INTO cart (user_id, product_id, quantity) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE quantity = quantity + ?;
    `;

    db.query(sql, [userID, productID, quantity, quantity], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product added to cart" });
    });
};

// Get user's cart
exports.getUserCart = (req, res) => {
    const { userID } = req.params;

    const sql = `
      SELECT c.id, p.title, p.price, c.quantity, (p.price * c.quantity) AS subtotal 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?;
    `;

    db.query(sql, [userID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        //Calculate grand total
        const totalAmount = results.reduce((sum, item) => sum + Number(item.subtotal), 0);

        res.json({
            cart: results,
            totalAmount
        });
    });
};

// Update quantity
exports.updateQuantity = (req, res) => {
    const { userID, productID, quantity } = req.body;

    const sql = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;

    db.query(sql, [quantity, userID, productID], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Quantity updated" });
    });
};

// Remove product
exports.removeFromCart = (req, res) => {
    const { userID, productID } = req.params;

    const sql = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;

    db.query(sql, [userID, productID], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product removed from cart" });
    });
};

// Clear cart
exports.clearCart = (req, res) => {
    const { userID } = req.params;

    const sql = `DELETE FROM cart WHERE user_id = ?`;

    db.query(sql, [userID], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cart cleared" });
    });
};
Z