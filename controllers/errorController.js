const AppError = require('../utils/appError');

const handlerCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handlerDuplicateErrorDB = err => {
    //const value = err.keyValue;
    const value = Object.values(err.keyValue)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // Programming or other unknow error: don't leak error details
    } else {
        // 1) Log error
        console.error('ERROR =((', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {

        let error = {...err};
        error.name = err.name;
        error.message = err.message;

        if (error.name === 'CastError') error = handlerCastErrorDB(error);
        if (error.code === 11000) error = handlerDuplicateErrorDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        
        sendErrorProd(error, res);
    };
}