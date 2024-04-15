const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = Model => 
    catchAsync(async (req, res, next) => {
        const docs = await Model.find();

        res.status(200).json({
            status: 'success',
            result: docs.length,
            data: {
                docs
            }
        });
});

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    
});

exports.getOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findById(req.params.id);

        if (!doc) {
            return next(new AppError(`Can't find any doc with that ID`, 404))
        };

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    
});

exports.updateOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError(`Can't find any doc with that ID`, 404))
        };

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
        
});

exports.deleteOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(`Can't find any doc with that ID`, 404))
        };

        res.status(204).json({
            status: 'success',
            data: {
                doc
            }
        });
});
