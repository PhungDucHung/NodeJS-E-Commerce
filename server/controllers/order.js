const Order = require('../models/order')
const User = require('../models/user');
const asyncHandler = require('express-async-handler')


const createOrder = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product','title price')
    const products = userCart?.cart?.map(el => ({
        product: el.product.id,
        count: el.quantity,
        color: el.color
    }))
    const total = userCart?.cart?.reduce((sum, el) => el.product.price*el.quantity + sum , 0)
    if(coupon) total = Math.round(total * (1 - coupon/100)/1000)*1000
    const rs = await Order.create({ products, total, orderBy: _id})
    return res.json({
        success: rs ? true : false,
        rs : rs ? rs : 'Something went wrong',
        userCart
    })
})

module.exports = {
    createOrder
}