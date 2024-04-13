const Product = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

    
        res.status(200).json({
            status: 'success',
            result: products.length,
            data: {
                products
            }
        });
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
    
        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
    
        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
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
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
    
        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        });
        
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
};

