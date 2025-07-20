const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:id', authController.resetPassword);
router.get('/user/:email', authController.getUserByEmail);


module.exports = router;
