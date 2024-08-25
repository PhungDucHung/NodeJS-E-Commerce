const express = require('express');
const router = express.Router(); // Thay đổi ở đây
const ctrls = require('../controllers/insertData');

    router.post('/',  ctrls.insertProduct);
    router.post('/cate',  ctrls.insertCategory);



module.exports = router