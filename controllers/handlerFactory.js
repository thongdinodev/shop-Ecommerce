const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


exports.getAll = Model => 
    catchAsync(async (req, res, next) => {

        // execute query
        const features = new APIFeatures(Model.find(), req.query)
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
