const express = require("express");
const router = express.Router();
const { createPayment } = require("../controllers/paymentController");

// PhonePe payment route
router.post("/phonepe", createPayment);

module.exports = router;
