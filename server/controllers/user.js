const User = require('../models/user'); // Import mô hình User từ thư mục models
const asyncHandler = require('express-async-handler'); // Import middleware để xử lý các lỗi bất đồng bộ
const { generateAccessToken , generateRefreshToken} = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../ultils/sendMail')
const crypto = require('crypto');
const makeToken = require('uniqid');
const {users} = require('../ultils/constant')

const register = asyncHandler(async(req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !lastname || !firstname || !mobile) 
        return res.status(400).json({
        success: false,
        mes: 'Missing inputs'
    })
    const user = await User.findOne({ email })
        if (user) throw new Error('User has existed')
        else {
            const token = makeToken()
            const emailedited = btoa(email)+'@'+token
            const newUser = await User.create({
                email: emailedited ,password, firstname, lastname, mobile
            })
            if(newUser){
                const html = `<h2>Register code:</h2><br/><blockquote>${token}</blockquote> `
                await sendMail({email, html, subject: 'Confirm register account in Digital World'})
            }
            setTimeout(async() => {
                await User.deleteOne({email: emailedited})
            },[300000])
             return res.json({
                success: newUser ? true : false,
                mes: newUser ? 'Please check your email to activate your account' : 'Something went wrong, please try later'
            });
        }
})

const finalRegister = asyncHandler(async (req, res) => {
    // Lấy token từ tham số URL
    const { token } = req.params;
    console.log('Received token:', token); // Log token nhận được

    // Tìm email trong cơ sở dữ liệu với token
    const notActivedEmail = await User.findOne({
        email: new RegExp(`${token}$`)
    });

    // Ghi log kết quả tìm kiếm
    console.log('Email found in database:', notActivedEmail);

    if (notActivedEmail) {
        // Giải mã email từ cơ sở dữ liệu
        const decodedEmail = atob(notActivedEmail.email.split('@')[0]);
        console.log('Decoded email:', decodedEmail);

        // Cập nhật email
        notActivedEmail.email = decodedEmail;

        // Lưu thay đổi vào cơ sở dữ liệu
        await notActivedEmail.save();
        console.log('Updated user:', notActivedEmail);
    } else {
        console.log('No email found for the given token');
    }

    // Tạo phản hồi JSON
    const response = {
        success: notActivedEmail ? true : false,
        mes: notActivedEmail ? 'Register is Successfully. please go login' : 'Something went wrong, please try again'
    };


    return res.json(response);
});

// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, phân quyên người dùng


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password ').populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        }
    })
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})

// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot Password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response.includes('OK') ? 'Hãy check mail của bạn. ' : 'Đã có lỗi, hãy thử lại sau'
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    // Format lại các operators cho đúng cú pháp MongoDB
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name) {
        formattedQueries.name = { $regex: queries.name, $options: 'i' };
    }
    if (req.query.q) {
        delete formattedQueries.q;
        formattedQueries.$or = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ];
    }

    let queryCommand = User.find(formattedQueries);

    // Xử lý sắp xếp ( sorting )
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Xử lý fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Xử lý phân trang
    const page = +req.query.page || 1; // Chuyển đổi page thành số, mặc định là 1 nếu không được cung cấp
    const limit = +req.query.limit || +process.env.LIMIT_PRODUCTS; // Chuyển đổi limit thành số, mặc định từ biến môi trường
    const skip = (page - 1) * limit; // Tính số lượng tài liệu cần bỏ qua

    queryCommand = queryCommand.skip(skip).limit(limit); // Áp dụng phân trang cho truy vấn

    try {
        // Thực hiện truy vấn và đếm tổng số tài liệu phù hợp với bộ lọc
        const users = await queryCommand.exec();
        const count = await User.countDocuments(formattedQueries); // Sử dụng countDocuments để đếm số lượng tài liệu

        return res.status(200).json({
            success: users.length > 0,
            counts: count,
            users: users.length > 0 ? users : 'Không có người dùng nào'
        });
    } catch (err) {
        // Xử lý lỗi và trả về mã trạng thái 500 với thông báo lỗi
        return res.status(500).json({ success: false, message: err.message });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} deleted` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    console.log(req.files)
    const { _id } = req.user
    const {firstname, lastname, email, mobile} = req.body
    const data = { firstname, lastname, email, mobile }
    if(req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Something went wrong'
    })
})
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing inputs');
    // Đảm bảo địa chỉ là mảng, nếu không thì biến nó thành mảng
    const newAddress = Array.isArray(req.body.address) ? req.body.address : [req.body.address];
    // Tìm người dùng và lấy thông tin địa chỉ hiện tại
    const user = await User.findById(_id).select('address');
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Tạo một mảng để lưu các địa chỉ cần xóa
    const addressesToRemove = [];
    // Duyệt qua địa chỉ mới và kiểm tra xem có trùng lặp với địa chỉ hiện tại không
    newAddress.forEach(address => {
        if (user.address.includes(address)) {
            addressesToRemove.push(address);
        }
    });
    // Nếu có địa chỉ trùng lặp, xóa chúng khỏi mảng address
    if (addressesToRemove.length > 0) {
        await User.findByIdAndUpdate(
            _id,
            { $pullAll: { address: addressesToRemove } }
        );
    }
    // Thêm các địa chỉ mới vào mảng address
    const response = await User.findByIdAndUpdate(
        _id,
        { $push: { address: { $each: newAddress } } },
        { new: true }
    ).select('-password -role -refreshToken');
    // Đảm bảo không có mảng con trong address
    if (response) {
        response.address = response.address.flat();
    }
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    });
});

const updateCart = asyncHandler(async(req, res)=> {
    const {_id} = req.user
    const { pid, quantity = 1, color } = req.body
    if(!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if(alreadyProduct){
            const response = await User.updateOne({cart: {$elemMatch: alreadyProduct}}, { $set: {"cart.$.quantity" : quantity, "cart.$.color" : color}},{new:true})
            return res.status(200).json({
                success: response ? true : false,
                mes: response ? 'Updated your cart' : 'Something went wrong'
            });
    }else{
    const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity , color}}},{new : true})
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated your cart' : 'Something went wrong'
    });
}
})

const removeProductInCart = asyncHandler(async(req, res)=> {
    const {_id} = req.user
    const { pid } = req.params
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if(!alreadyProduct)  return res.status(200).json({
        success: true,
        mes: 'Updated your cart'
    });
    const response = await User.findByIdAndUpdate(_id, {$pull: {cart: {product: pid }}},{new : true})
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated your cart' : 'Something went wrong'
    });
})


 const createUsers = asyncHandler(async(req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : 'Something went wrong'
    });
 })

module.exports = {
    register, login ,getCurrent ,refreshAccessToken , logout ,forgotPassword ,resetPassword ,getUsers ,deleteUser ,updateUser,updateUserByAdmin , updateUserAddress, updateCart, finalRegister ,createUsers, removeProductInCart
};
 