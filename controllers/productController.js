const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        status: 'success',
        result: products.length,
        data: {
            products
        }
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
    
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
    
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
    
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

