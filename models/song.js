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

songSchema.virtual('created').get(() => {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

module.exports = mongoose.model('Song', songSchema);
