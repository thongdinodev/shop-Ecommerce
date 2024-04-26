const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const mongoSanatize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(helmet())

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 100,
    message: 'Too many api request, try again after 60 minutes'
})

app.use('/api', limiter)

app.use(express.json({limit: '10kb'}));

app.use(mongoSanatize())

app.use(xss())

app.use(hpp({
    whitelist: [
        'price',
        'ratingsAverage',
        'ratingsQuantity',
        'instock'
    ]
}))

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;