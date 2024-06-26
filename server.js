const app = require('./app');
const mongoose = require('mongoose');
const swaggerDocs = './swagger.js'

const port = process.env.PORT || 3000;

process.on('uncaughtException', err => {
    console.log('UNCAUGT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Success to connect with mongoDB');
})
.catch((err) => {
    console.log(err);
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
