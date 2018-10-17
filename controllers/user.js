const Song = require('../models/song.js');
const User = require('../models/user.js');
const spotifyAPI = require('../lib/spotify.js');

module.exports = (app) => {
    app.get('/user/:username', (req, res) => {
        const currentUser = req.user;
        User.findOne({
                username: req.params.username
            }).populate('shares')
            .then((user) => {
                const songIDs = user.shares.map(a => a.spotifySongID);
                spotifyAPI.getTracks(songIDs)
                    .then((songs) => {
                        for (let i = 0; i < songs.body.tracks.length; ++i) {
                            songs.body.tracks[i].user = user;
                        }


                        res.render('user-profile', {
                            songs: songs.body.tracks,
                            currentUser: currentUser,
                            user: user,
                            profile: true,
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
            });
    });

    
}
