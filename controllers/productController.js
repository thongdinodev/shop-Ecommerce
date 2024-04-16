const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const { getAll, createOne, getOne, updateOne, deleteOne } = require('./handlerFactory');

exports.getAllProducts = getAll(Product);

exports.createProduct = createOne(Product);
exports.getProduct = getOne(Product);
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);

exports.aliasTopProducts = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-price,-ratingsAverage';
    req.query.fields = 'price,name,instock,photo,ratingsAverage'; 

    next();
};

