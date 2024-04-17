const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


exports.getAll = Model => 
    catchAsync(async (req, res, next) => {

        // execute query
        const features = new APIFeatures(Model.find({}, {_id: 0}), req.query)
        // {_id: 0} to handler error: Cannot do exclusion on field createdAt in inclusion projection
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

exports.getOne = (Model, popOptions) => 
    catchAsync(async (req, res, next) => {
        // const doc = await Model.findById(req.params.id);
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;
        
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
