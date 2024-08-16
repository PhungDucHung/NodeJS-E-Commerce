const User = require('../models/user'); // Import mô hình User từ thư mục models
const asyncHandler = require('express-async-handler'); // Import middleware để xử lý các lỗi bất đồng bộ

// Hàm xử lý đăng ký người dùng
const register = asyncHandler(async (req, res) => {
    // Lấy các trường từ body của yêu cầu
    const { email, password, firstname, lastname } = req.body;
    // Kiểm tra xem tất cả các trường có được cung cấp hay không
    if (!email || !password || !firstname || !lastname) 
        // Nếu thiếu trường nào, trả về phản hồi lỗi
        return res.status(404).json({
            success: false,
            message: 'Missing inputs'
        });

        // kiểm tra email đã tồn tại chưa
        const user = await User.findOne({email});
        if(user)
            throw new Error('User not existed');
        else{
            const newUser = await User.create(req.body);

            return res.status(200).json({
                success: newUser ? true : false, 
                message: newUser ? 'Register is successfully. please go login' : 'Something went wrong'
            });
        }
});

module.exports = {
    register
};
