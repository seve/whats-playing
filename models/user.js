const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        select: false,
    },
    following: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User',
    }],
    spotifyUserID: {
        type: String,
        trim: true,
        required: false,
    }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
