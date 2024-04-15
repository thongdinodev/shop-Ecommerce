const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
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

    user.password = undefined;
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
})