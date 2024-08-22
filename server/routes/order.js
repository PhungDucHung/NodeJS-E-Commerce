const express = require('express');
const router = express.Router(); // Thay đổi ở đây
const {verifyAccessToken , isAdmin} = require('../middlewares/verifyToken');
const ctrls = require('../controllers/order')

router.post('/', verifyAccessToken, ctrls.createOrder);

module.exports = router