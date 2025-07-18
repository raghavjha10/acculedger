const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Route: Reset Password
router.post('/reset-password/:id', passwordController.resetPassword);

module.exports = router;
