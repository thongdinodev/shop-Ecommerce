const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN * 60 * 60 * 24 * 1000
    });
};

const createSendToken = (user, res, statusCode) => {
    const token = signToken(user._id);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    createSendToken(user, res, 200);
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new AppError('Incorrect email or password in login', 400));
    }

    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
        return next(new AppError('Wrong password, please try again!', 401));
    }

    createSendToken(user, res, 200);
});

