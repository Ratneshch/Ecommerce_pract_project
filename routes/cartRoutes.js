const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middleware/auth");

router.post("/add", authenticateToken, cartController.addToCart);
router.get("/user", authenticateToken, cartController.getUserCart);
router.post("/update", authenticateToken, cartController.updateQuantity);
router.delete("/remove/:productID", authenticateToken, cartController.removeFromCart);
router.delete("/clear", authenticateToken, cartController.clearCart);

module.exports = router;
