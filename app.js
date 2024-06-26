const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const mongoSanatize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cron = require('node-cron')
const swaggerjsdoc = require('swagger-jsdoc')
const swaggerui = require('swagger-ui-express')

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

const wakeupServer = app.get('/api/wakeupServer', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'server is wake up'
    })
})

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Shop Ecommerce API',
        description: 'The Ecommerce shop NodeJS API contains endpoints for Products, Users, and Reviews',
        contact: {
            name: 'Thong Dino',
            email: 'thong.dino.dev@gmail.com'
        },
        version: '1.0.0',
      },
    },
    // looks for configuration in specified directories
    apis: ['./routes/*.js'],
  }

const spacs = swaggerjsdoc(options)

app.use(
    '/api-doc',
    swaggerui.serve,
    swaggerui.setup(spacs)
)

// cron.schedule('*/2 * * * * *', () => {
//     console.log('Server is wake up')
//     app.use(wakeupServer())
// })

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);




module.exports = app;