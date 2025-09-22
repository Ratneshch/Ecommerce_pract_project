const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/auth');

//product routes

router.post("/add", authenticateToken, cartController.addToCart);
router.get("/user/:userID", authenticateToken, cartController.getUserCart);
router.post("/update", authenticateToken, cartController.updateQuantity);

router.delete("/remove/:userID/:productID", authenticateToken, cartController.removeFromCart);

router.delete("/clear/:userID", authenticateToken, cartController.clearCart);

module.exports = router;