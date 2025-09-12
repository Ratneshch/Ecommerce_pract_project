const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// Routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getProfile);
router.get('/all', userController.getAllUsers);

module.exports = router;