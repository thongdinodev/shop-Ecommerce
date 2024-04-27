const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('../utils/cloudinary')

exports.getAll = (Model, popOptions) => 
    catchAsync(async (req, res, next) => {
        // allow to get nested review route
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        


        // execute query
        let features = new APIFeatures(Model.find(filter), req.query)
        // {_id: 0} to handler error: Cannot do exclusion on field createdAt in inclusion projection
            .filter()
            .sort()
            .limitFields()
            .paginate();

        if (popOptions) features = await features.query.populate(popOptions);
        
        const docs = features;

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
        // if (!req.file) next()

        const responseCloudinary = await cloudinary.uploader.upload(req.file.path, {
            public_id: req.file.filename,
            folder: 'product-shopEcommerce'
        })
        req.body.image = responseCloudinary.url

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
