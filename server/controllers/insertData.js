const Product = require('../models/product');
const asyncHandler = require('express-async-handler')
const data = require('../../data/data2.json')
const slugify = require('slugify');
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory')


const fn = async (product) => {
    // Lấy danh sách các màu sắc từ biến thể "Color"
    const colorVariants = product?.variants?.find(el => el.label === 'Color')?.variants;
    // Kiểm tra nếu colorVariants tồn tại và có ít nhất một giá trị
    const color = (colorVariants && colorVariants.length > 0) ? colorVariants[0] : 'DEFAULT_COLOR'; // Thay 'DEFAULT_COLOR' bằng giá trị màu mặc định nếu cần
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 10000) + ' ',
        description: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: color // Đảm bảo giá trị color được cung cấp
    });
}

const insertProduct = asyncHandler(async(req,res)=>{
    const promises = []
    for (let product of data) promises.push(fn(product))
    await Promise.all(promises)
    return res.json('Done')
})

const fn2 = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate + Math.round(Math.random() * 10000) + ' ',
        brand: cate?.brand + Math.round(Math.random() * 10000) + ' ',
    })
}

const insertCategory = asyncHandler(async(req,res)=>{
    const promises = []
    for (let cate of categoryData) promises.push(fn2(cate))
    await Promise.all(promises)
    return res.json('Done')
})

module.exports = {
    insertProduct, insertCategory
}