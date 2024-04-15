const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getAll, createOne, getOne, updateOne, deleteOne } = require('./handlerFactory');


exports.getAllProducts = getAll(Product);
exports.createProduct = createOne(Product);
exports.getProduct = getOne(Product);
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);


