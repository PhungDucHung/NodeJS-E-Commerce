const mongoose = require('mongoose'); // Import thư viện Mongoose để tương tác với MongoDB

// Khai báo Schema của mô hình MongoDB
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true, // Trường này là bắt buộc phải có giá trị
    },
    lastname: {
        type: String,
        required: true, // Trường này là bắt buộc phải có giá trị
    },
    email: {
        type: String,
        required: true, // Trường này là bắt buộc phải có giá trị
        unique: true, // Đảm bảo giá trị là duy nhất trong cơ sở dữ liệu
    },
    mobile: {
        type: String,
        required: true, // Trường này là bắt buộc phải có giá trị
        unique: true, // Đảm bảo giá trị là duy nhất trong cơ sở dữ liệu
    },
    password: {
        type: String,
        required: true, // Trường này là bắt buộc phải có giá trị
    },
    role: {
        type: String,
        default: 'user', // Giá trị mặc định là 'user' nếu không cung cấp
    },
    cart: {
        type: Array,
        default: [], // Giá trị mặc định là mảng rỗng nếu không cung cấp
    },
    address: [{
        type: mongoose.Types.ObjectId, // Liên kết đến đối tượng Address
        ref: 'Address' // Tham chiếu đến mô hình Address
    }],
    wishlist: [{
        type: mongoose.Types.ObjectId, // Liên kết đến đối tượng Product
        ref: 'Product' // Tham chiếu đến mô hình Product
    }],
    isBlocked: {
        type: Boolean,
        default: false, 
    },
    refreshToken: {
        type: String,
    },
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String,
    }
}, {
    timestamps: true // Tự động thêm các trường `createdAt` và `updatedAt` vào mô hình
});

// Xuất mô hình User để sử dụng trong các phần khác của ứng dụng
module.exports = mongoose.model('User', userSchema);
