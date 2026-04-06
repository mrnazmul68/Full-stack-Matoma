const express = require('express');

const {
  forgotPassword,
  getSession,
  login,
  logout,
  register,
  resetPassword,
  sendOtp,
  verifyOtp,
} = require('../controllers/authController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/session', getSession);
router.post('/logout', logout);

module.exports = router;
