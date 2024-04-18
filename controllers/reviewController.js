const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;

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
    const features = new APIFeatures(Review.find(filter).lean(), req.query)
    // {_id: 0} to handler error: Cannot do exclusion on field createdAt in inclusion projection
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
