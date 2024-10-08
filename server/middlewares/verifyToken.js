const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Bearer token
    // headers: { authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                mes: 'Invalid access token'
            })
            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Require authentication!!!'
        })
    }
})

const isAdmin = asyncHandler((req, res, next) => {
    // Lấy role của người dùng từ đối tượng req.user
    const { role } = req.user;
    // Kiểm tra xem role của người dùng có phải là 'admin' không
    if (role !== 'admin') {
        // Nếu không phải là admin, trả về phản hồi lỗi với mã trạng thái 401
        return res.status(401).json({
            success: false,
            mes: 'REQUIRE ADMIN ROLE'
        });
    }
    // Nếu người dùng là admin, tiếp tục xử lý tiếp theo trong chuỗi middleware
    next();
});


module.exports = {
    verifyAccessToken , isAdmin
}