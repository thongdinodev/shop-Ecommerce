const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllReview = handlerFactory.getAll(Review);
exports.createReview = handlerFactory.createOne(Review);
