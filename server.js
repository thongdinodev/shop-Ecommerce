const app = require('./app');
const swaggerDocs = './swagger.js'
const ConnectDatabaseSingleton = require('./db/databse.connect.singleton')

const port = process.env.PORT || 3000;

process.on('uncaughtException', err => {
    console.log('UNCAUGT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

ConnectDatabaseSingleton.getInstance()

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
