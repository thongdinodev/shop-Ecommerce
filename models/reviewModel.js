// review, rating, createdAt, ref with tour, user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: [1, 'Ratting must be above 1'],
        max: [5, 'Ratting must be below 5']
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.pre(/^find/, function(next) {
    this
    // .lean()
    .populate({
        path: 'product',
        select: 'name price'
    })
    .populate({
        path: 'user',
        select: 'name email photo'
    });

    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;