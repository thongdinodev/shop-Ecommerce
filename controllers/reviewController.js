const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createReview = handlerFactory.createOne(Review);
exports.getAllReview = catchAsync(async (req, res, next) => {

    // execute query
    const features = new APIFeatures(Review.find({}, {_id: 0}).lean(), req.query)
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
