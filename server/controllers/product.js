const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    const {title, price, description , brand, category ,color} = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req?.files?.images?.map(el => el.path)
    if (!(title && price && description && brand && category, color)) throw new Error('Missing inputs')
    req.body.slug = slugify(title)
    if(thumb) req.body.thumb = thumb 
    if(images) req.body.images = images 
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Created' : 'Failed.'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    // Format lại các operators cho đúng cú pháp MongoDB
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formattedQueries = JSON.parse(queryString);
    let colorQueryObject = {};

    if (queries?.title) formattedQueries.title = { $regex: queries.title, $options: 'i' }; 
    if (queries?.category) formattedQueries.category = { $regex: queries.category, $options: 'i' }; 
    if (queries?.color) {
        delete formattedQueries.color;
        const colorArr = queries.color?.split(',');
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }));
        colorQueryObject = { $or: colorQuery };
    }

    let queryObject = {};
    if (queries?.q) {
        delete formattedQueries.q;
        queryObject = { $or: [
            { color: { $regex: queries.q, $options: 'i' } },
            { title: { $regex: queries.q, $options: 'i' } },
            { category: { $regex: queries.q, $options: 'i' } },
            { brand: { $regex: queries.q, $options: 'i' } },
            { description: { $regex: queries.q, $options: 'i' } },
        ]};
    }

    const qr = { ...colorQueryObject, ...formattedQueries, ...queryObject };
    let queryCommand = Product.find(qr);

    // Xử lý sắp xếp (sorting)
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
        const products = await queryCommand.exec();
        const count = await Product.countDocuments(qr); // Sửa ở đây

        return res.status(200).json({
            success: products.length > 0,
            counts: count,
            products: products.length > 0 ? products : 'Không thể lấy sản phẩm'
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path
    if (files?.images) req.body.images = files?.images?.map(el => el.path)
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        mes: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        mes: deletedProduct ? 'Deleted' : 'Cannot delete product'
    })
})

const ratings = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const { star , comment , pid, updatedAt } = req.body
    if (!star || !pid) throw new Error('Missing inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
    // console.log({alreadyRating})
    if (alreadyRating){
        // update start & comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        },{
            $set: {"ratings.$.star":star,"ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt}
        },{new: true })
    }else{
        // add star & comment
         await Product.findByIdAndUpdate(pid, {
            $push: {ratings: {star, comment, postedBy: _id, updatedAt}}
        },{new: true})
        console.log(response)
    }

    // Sum ratings
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star ,0)
    updatedProduct.totalRatings = Math.round(sumRatings*10/ratingCount) / 10
    await updatedProduct.save()

    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImagesProduct = asyncHandler(async(req, res) => {
    console.log(req.files);
    const {pid} = req.params
    if(!req.files) throw new Error('Missing inputs');
    const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}},{new: true});
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })
})

module.exports = {
    createProduct, getProduct, getProducts ,updateProduct, deleteProduct, ratings, uploadImagesProduct 
}