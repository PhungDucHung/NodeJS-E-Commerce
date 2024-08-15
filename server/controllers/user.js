const User = require('../models/user'); // Import mô hình User từ thư mục models
const asyncHandler = require('express-async-handler'); // Import middleware để xử lý các lỗi bất đồng bộ

// Hàm xử lý đăng ký người dùng
const register = asyncHandler(async (req, res) => {
    // Lấy các trường từ body của yêu cầu
    const { email, password, firstname, lastname } = req.body;
    // Kiểm tra xem tất cả các trường có được cung cấp hay không
    if (!email || !password || !firstname || !lastname) {
        // Nếu thiếu trường nào, trả về phản hồi lỗi
        return res.status(404).json({
            success: false,
            message: 'Missing inputs'
        });
    }

    // Tạo người dùng mới với thông tin từ yêu cầu
    const response = await User.create(req.body);

    // Trả về phản hồi thành công với thông tin người dùng mới
    return res.status(200).json({
        success: response ? true : false,
        response
    });
});

module.exports = {
    register
};
