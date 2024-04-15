const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        unique: true
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;