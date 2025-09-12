const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Routes
router.post('/add', productsController.addProduct);
router.get('/all', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;