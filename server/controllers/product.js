const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
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

    // Filtering
    if (queries?.title) {
        formattedQueries.title = { $regex: queries.title, $options: 'i' }; 
    }
    
    let queryCommand = Product.find(formattedQueries);

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
          const products = await queryCommand.exec();
          const count = await Product.countDocuments(formattedQueries);
  
          return res.status(200).json({
              success: products.length > 0,
              counts: count,
              products: products.length > 0 ? products : 'Không thể lấy sản phẩm'
          });
      } catch (err) {
          // Xử lý lỗi và trả về mã trạng thái 500 với thông báo lỗi
          return res.status(500).json({ success: false, message: err.message });
      }
  });




const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

module.exports = {
    createProduct, getProduct, getProducts ,updateProduct, deleteProduct

}