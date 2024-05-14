
const {register,login,logout, sendOtp} = require('../controllers/authControllers');
const router = require('express').Router();
router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/sendOtp',sendOtp)

module.exports = router;