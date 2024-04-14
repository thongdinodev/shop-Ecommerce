const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Success to connect with mongoDB');
})
.catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

