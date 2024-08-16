const User = require('../models/user'); // Import mô hình User từ thư mục models
const asyncHandler = require('express-async-handler'); // Import middleware để xử lý các lỗi bất đồng bộ
const { generateAccessToken , generateRefreshToken} = require('../middlewares/jwt')



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

// Refresh token => cấp mới access token
// Access token => xác thực người dùng , phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password} = req.body;
    if (!email || !password ) 
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });

        const response = await User.findOne({email});
        if (response && await response.isCorrectPassword(password)) {
            // tách password và role ra khỏi response 
            const{ password, role, ...userData } = response.toObject()  // response.toObject() trả về object thuần
            // tạo access token
            const accessToken = generateAccessToken(response._id, role);
            // tạo refresh token
            const refreshToken = generateRefreshToken(response._id);
            // Lưu refresh token vào database
            await User.findByIdAndUpdate(response._id, { refreshToken } ,{ new:true });
            // Lưu refresh token vào cookie
            res.cookie('refreshToken', refreshToken , { httpOnly: true, maxAge: 7*24*60*60*1000 })
            return res.status(200).json({
                success: true,
                accessToken,
                userData
            });
        }else{
            throw new Error('Invalid credentials !')
        }
});


const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-refreshToken -password -role');
    return res.status(200).json({
        success: false,
        rs: user ? user : 'user not found'
    });
});


module.exports = {
    register, login ,getCurrent
};
