const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');

exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);