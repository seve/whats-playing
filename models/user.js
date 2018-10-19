const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
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
        unique: false,
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User',
        unique: false,
    }],
    name: {
        type: String,
        trim: true,
        required: false,
    },
    shares: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Song',
    }]
});



UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.name = this.name || this.username;

    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    next();
});

UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};



module.exports = mongoose.model('User', UserSchema);
