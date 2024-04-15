const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,

    }
    ,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password is not less than 8 character'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide a passwordConfirm'],
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: 'password is not the same'

        }
    },
    photo: {
        type: String,
        default: 'user-default.png'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;