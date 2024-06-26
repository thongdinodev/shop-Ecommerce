const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {reviewValidate} = require('../utils/validation')
const APIFeatures = require('../utils/apiFeatures');

exports.createReview = catchAsync(async (req, res, next) => {
    
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;

    const {error} = reviewValidate(req.body)
    console.log('=====ERROR=====',  error);
    if (error) {
        throw new Error(`${error.details[0].message}`)
    }

    const doc = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });

});

exports.getAllReview = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter.product = req.params.productId;

    // execute query
    // {_id: 0} to handler error: Cannot do exclusion on field createdAt in inclusion projection
    const features = new APIFeatures(Review.find(filter).lean(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const docs = await features.query;

    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: {
            docs
        }
    });
});

exports.getReview = handlerFactory.getOne(Review);
exports.updateReview = catchAsync(async (req, res, next) => {

    const doc = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });


    if (!doc) {
        return next(new AppError(`Can't find any doc with that ID`, 404))
    };

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
    
});

exports.deleteReview = handlerFactory.deleteOne(Review);