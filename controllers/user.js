const Song = require('../models/song.js');
const User = require('../models/user.js');
const spotifyAPI = require('../lib/spotify.js');
const gravatar = require('gravatar');

module.exports = (app) => {
    app.get('/user/:username', (req, res) => {
        const currentUser = req.user;
        User.findOne({
                username: req.params.username
            }).populate('shares')
            .then((user) => {
                const songIDs = user.shares.map(a => a.spotifySongID);
                const gravatarImg = gravatar.url(user.email, {s: '175', r: 'r', d: 'retro'}, false);

                spotifyAPI.getTracks(songIDs)
                    .then((songs) => {
                        for (let i = 0; i < songs.body.tracks.length; ++i) {
                            songs.body.tracks[i].user = user;
                        }


                        res.render('user-profile', {
                            songs: songs.body.tracks,
                            currentUser: currentUser,
                            user: user,
                            avatar: gravatarImg,
                            profile: true,
                        });
                    }, (err) => {
                        console.error(err);
                        res.render('user-profile', {
                            songs: [],
                            currentUser: currentUser,
                            user: user,
                            avatar: gravatarImg,
                            profile: true,

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
