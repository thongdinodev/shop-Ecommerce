const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const { getAll, createOne, getOne, updateOne, deleteOne } = require('./handlerFactory');

exports.getAllProducts = getAll(Product, { path: 'customer', select: '-__v'});

exports.createProduct = createOne(Product);
exports.getProduct = getOne(Product, { path: 'reviews' });
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);

exports.aliasTopProducts = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-price,-ratingsAverage';
    req.query.fields = 'price,name,instock,photo,ratingsAverage'; 

    next();
};

exports.getProductStats = catchAsync(async (req, res, next) => {
    const productStats = await Product.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5, $lt: 5}
            }
        },
        {
            $group: {
                _id: null,
                numsProduct: { $sum: 1 },
                avgRatings: { $avg: '$ratingsAverage' },
                sumPrice: { $sum: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        }
        
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            productStats
        }
    });
});