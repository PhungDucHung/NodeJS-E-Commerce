const express = require('express');
const router = express.Router();
const ctrls = require('../controllers/user'); // Import controller chứa các hàm xử lý

// Định nghĩa route POST cho việc đăng ký người dùng
router.post('/register', ctrls.register);
router.post('/login', ctrls.login);


module.exports = router;
