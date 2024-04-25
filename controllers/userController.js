const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {


    // execute query
    // {_id: 0} to handler error: Cannot do exclusion on field createdAt in inclusion projection
    const features = new APIFeatures(User.find().lean(), req.query)
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

exports.getUser = getOne(User);
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Can not update password with this route, please use /updateMyPassword', 400))
    }

    const filterBody = filterObj(req.body, 'name', 'email');
    console.log(filterBody);
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false})

    res.status(204).json({
        status: 'success',
        message: 'OK, delete user success'
    })
})