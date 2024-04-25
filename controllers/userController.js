const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');

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

exports.getAllUsers = getAll(User);
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
exports.deleteUser = deleteOne(User);