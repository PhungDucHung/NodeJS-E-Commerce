const express = require('express');
const router = express.Router();
const ctrls = require('../controllers/user'); // Import controller chứa các hàm xử lý
const { verifyAccessToken} = require('../middlewares/verifyToken');


// Định nghĩa route POST cho việc đăng ký người dùng
router.post('/register', ctrls.register);
router.post('/login', ctrls.login);
router.get('/current', verifyAccessToken , ctrls.getCurrent);

module.exports = router;
