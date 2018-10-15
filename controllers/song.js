const User = require('../models/song.js');

module.exports = (app) => {
    app.get('/', (req, res) => {
        const trackIds = ['35yZkNFNVosiHE6Uj0COVM', '7qU7vhCPKhkDiJYGoboISc', '33JMMgxQKL3zJsZeMNC3gR'];
        spotifyAPI.getTracks(trackIds)
        .then((data) => {
            res.render('home', { songs: data.body.tracks})
        },
        (err) => {
            console.error(err);
        });
    });
}
