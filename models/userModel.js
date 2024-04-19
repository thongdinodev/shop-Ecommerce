const mongoose = require('mongoose');
const crypto = require('crypto');
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
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;