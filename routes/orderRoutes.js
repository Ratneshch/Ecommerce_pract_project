const express = require("express");
const router = express.Router();
const { placeOrder, getOrderById } = require("../controllers/orderController");

// Place order
router.post("/", placeOrder);

// Get order by ID
router.get("/:id", getOrderById);

module.exports = router;
