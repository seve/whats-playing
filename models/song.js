const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = mongoose.Schema({
    spotifySongID: {
        type: String,
        required: true
    },
    privacy: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Song', songSchema);
