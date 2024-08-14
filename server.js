const express = require('express');

// Import thư viện dotenv để sử dụng biến môi trường từ tệp .env
require('dotenv').config();

// Tạo một đối tượng ứng dụng Express
const app = express();

const port = process.env.PORT || 8888;

// Middleware để phân tích dữ liệu JSON trong các yêu cầu
app.use(express.json());

// Middleware để phân tích dữ liệu URL-encoded (dữ liệu từ các form HTML)
app.use(express.urlencoded({ extended: true }));

// Định nghĩa một route đơn giản cho yêu cầu HTTP GET đến '/'
app.use('/', (req, res) => {
    res.send('SERVER ON');
});

// Bắt đầu máy chủ và lắng nghe các yêu cầu trên cổng đã chỉ định
app.listen(port, () => {
    console.log('Server running on port ' + port);
});
