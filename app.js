const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');


const port = process.env.PORT || 3000;

const app = express();


mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Success to connect with mongoDB');
}).catch((err) => {
    console.log(err);
});

app.use(express.json());

app.use('/api/products', productRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});