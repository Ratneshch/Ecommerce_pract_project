const express = require("express");
const router = express.Router();
const { addOrUpadteAddress, getAddressByUser, deleteAddress } = require("../controllers/addressController");

// Add or Update
router.post("/", addOrUpadteAddress);

// Get Address by User ID
router.get("/:user_id", getAddressByUser);

// Delete Address
router.delete("/:user_id", deleteAddress);

module.exports = router;
