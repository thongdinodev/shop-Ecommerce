const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const { getAll, createOne, getOne, updateOne, deleteOne } = require('./handlerFactory');
const multer = require('multer')

const multerStorage = multer.diskStorage({
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        cb(null, `product-${req.params.productId}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false)
      }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadProductImage = upload.single('product')

exports.getAllProducts = getAll(Product, { path: 'customer', select: '-__v -passwordChangedAt'});

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