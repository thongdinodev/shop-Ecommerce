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

exports.protected = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = (req.headers.authorization).split(' ')[1];
    };

    if (!token) {
        return next(new AppError('You are not logged in, please log in to get access', 401));
    };

    // decoded
    var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    };

    req.user = currentUser;
    
    next();
});

exports.restricTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`You don't have permission to do this action!`, 403));
        }
        next();
    };
};