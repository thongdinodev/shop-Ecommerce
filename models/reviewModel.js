// review, rating, createdAt, ref with tour, user
const mongoose = require('mongoose');
const Product = require('./productModel');

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

reviewSchema.statics.calcRatingsAverage = async function(productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId}
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating'}
            }
        }
    ]);
    if (stats.length) {
        await Product.findByIdAndUpdate(productId,{
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        });
    } else {
        await Product.findByIdAndUpdate(productId,{
            ratingsAverage: 4.5,
            ratingsQuantity: 0
        });
    }
};

reviewSchema.post('save', function() {
    this.constructor.calcRatingsAverage(this.product);
});

// reviewSchema.pre('save', function(next) {
//     this.constructor.calcRatingsAverage(this.product);
//     next();
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;