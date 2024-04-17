const mongoose = require('mongoose');
const _ = require('lodash');
// const User = require('./userModel');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product must have a name'],
        trim: true,
        unique: true,
        maxlength: [30, 'A product name must have less or equal 30 characters'],
        minlength: [5, 'A product name must have less or equal 5 characters'],
    },
    slug: String,
    price: {
        type: Number,
        required: [true, 'Product must have a price']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: [true, 'A product must have a image']
    },
    instock: {
        type: Number,
        min: [0, 'Out of stock'],
        default: 1
    },
    description: {
        type: String,
        required: [true, 'A product must have a description']
    },
    customer: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
}, {
    toJSON: {virtuals: true}
});

// Virtual
productSchema.virtual('totalPrice').get(function() {
    return this.price * this.instock;
});


productSchema.pre('save', function(next) {
    this.slug = _.kebabCase(this.name);
    next();
});

productSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'customer',
        select: '-__v'
    });
    next();
})


const Product = mongoose.model('Product', productSchema);

module.exports = Product;