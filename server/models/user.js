const mongoose = require('mongoose'); // Import thư viện Mongoose để tương tác với MongoDB
const bcrypt = require('bcrypt');
const crypto = require('crypto')

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
    avatar: {
        type: String,
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
    cart: [{
        product: {type: mongoose.Types.ObjectId,  ref: 'Product'  },
        quantity: Number,
        color: String,

    }],
    address: String,
    wishlist: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Product' 
    }],
    isBlocked: {        // khóa chức năng người dùng
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
    },
    registerToken: {
        type: String,
    },
}, {
    timestamps: true // Tự động thêm các trường `createdAt` và `updatedAt` vào mô hình
});



userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
    });

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        // Tạo một token ngẫu nhiên với kích thước 32 byte và chuyển đổi nó thành định dạng hex
        const resetToken = crypto.randomBytes(32).toString('hex');       
        // Mã hóa token ngẫu nhiên bằng thuật toán SHA-256 và lưu trữ hash trong thuộc tính passwordResetToken
        // Điều này bảo vệ token gốc khỏi bị lộ, vì chỉ lưu trữ hash của token
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // Xác định thời gian hết hạn của token (15 phút kể từ thời điểm hiện tại)
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        // Trả về token gốc để gửi cho người dùng qua email hoặc các phương tiện khác
        return resetToken;
    }
}

module.exports = mongoose.model('User', userSchema);
