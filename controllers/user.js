const Song = require('../models/song.js');
const User = require('../models/user.js');
const spotifyAPI = require('../lib/spotify.js');

module.exports = (app) => {
    app.get('/user/:username', (req, res) => {
        let currentUser = req.user;
        User.findOne({
                username: req.params.username
            }).populate('shares')
            .then((user) => {
                const songIDs = user.shares.map(a => a.spotifySongID);
                console.log(user.shares);
                spotifyAPI.getTracks(songIDs)
                    .then((songs) => {
                        console.log("Found User's Shares:", songs);
                        res.render('user-profile', {
                            songs: songs.body.tracks,
                            currentUser: currentUser,
                            user: user,
                            helpers: {
                                ifEquals: function(arg1, arg2, options) {
                                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                                }
                            }
                        });
                    }, (err) => {
                        console.error(err);
                        res.render('user-profile', {
                            songs: [],
                            currentUser: currentUser,
                            user: user,
                            helpers: {
                                ifEquals: function(arg1, arg2, options) {
                                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                                }
                            }
                        });
                    });

            }).catch((err) => {
                console.error(err);
            })
    })
}
