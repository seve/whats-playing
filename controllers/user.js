const Song = require('../models/song.js');
const User = require('../models/user.js');

module.exports = (app) => {
    app.get('/user/:username', (req, res) => {
        User.findOne({ username: req.params.username })
        .then((user) => {
            const songsIDs = user.shares;
            //TODO: Figure out how to manage the spotify api helper and its Credentials
        }).catch((err) => {
            console.error(err);
        })
    })
}
