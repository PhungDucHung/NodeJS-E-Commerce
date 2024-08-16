const jwt = require('jsonwebtoken'); // Import thư viện jsonwebtoken để tạo và xác thực token

/**
 * Tạo token truy cập (access token) cho người dùng
 * @param {string} uid - ID của người dùng (user ID) 
 * @param {string} role - Vai trò của người dùng (user role)
 */
const generateAccessToken = (uid, role) => {
    // Tạo và ký token với payload chứa ID người dùng và vai trò
    // Sử dụng khóa bí mật từ biến môi trường JWT_SECRET
    // Token có thời gian hết hạn là 3 ngày
    return jwt.sign(
        { _id: uid, role }, // Payload chứa ID và vai trò của người dùng
        process.env.JWT_SECRET, // Khóa bí mật để ký token, phải được cấu hình trong biến môi trường
        { expiresIn: '3d' } // Thời gian hết hạn của token là 3 ngày
    );
}

const generateRefreshToken = (uid) => {
    return jwt.sign(
        { _id: uid}, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' } 
    );
}

module.exports = {
    generateAccessToken, generateRefreshToken }
