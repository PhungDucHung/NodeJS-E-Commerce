const express = require('express');
require('dotenv').config();
const dbConnect = require('./server/config/dbconnect')
const initRoutes = require('./server/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors')


const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    method: ['POST', 'PUT', 'GET', 'DELETE'],
    credentials: true,
}))
app.use(cookieParser());
const port = process.env.PORT || 8888;

// Middleware để phân tích dữ liệu JSON trong các yêu cầu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect()
initRoutes(app)    

// Bắt đầu máy chủ và lắng nghe các yêu cầu trên cổng đã chỉ định
app.listen(port, () => {
    console.log('Server running on port ' + port);
});
