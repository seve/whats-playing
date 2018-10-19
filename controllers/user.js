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
                var following = false;
                // Remove any private shares and check to see if current user is following
                if (currentUser && currentUser._id != user._id) {
                    following = user.followers.map(follower=>follower.toString()).includes(currentUser._id);
                    user.shares = user.shares.filter((song) => {
                        if (song.privacy == 2 && song.mentionID != currentUser._id) {
                            return false;
                        }
                        return true;
                    })
                }


                const songIDs = user.shares.map(a => a.spotifySongID);
                const gravatarImg = gravatar.url(user.email, {
                    s: '175',
                    r: 'r',
                    d: 'retro'
                }, false);

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
                            following
                        });
                    }, (err) => {
                        console.error(err);
                        res.render('user-profile', {
                            songs: [],
                            currentUser: currentUser,
                            user: user,
                            avatar: gravatarImg,
                            profile: true,
                            following,

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

    app.post('/unfollow', (req, res) => {
        User.findById(req.user._id)
            .then((user) => {
                user.following.pull(req.body.user);
                user.save().then((user) => {
                    User.findById(req.body.user)
                        .then((user2) => {
                            user2.followers.pull(req.user._id);
                            user2.save().then((user2) => {
                                console.log("User:", user._id, "unfollowed user:", req.body.user);
                                return res.status(200).send({
                                    user
                                });
                            }).catch((err) => {
                                console.error(err);
                                return res.status(400).send({
                                    err: err
                                });
                            });
                        }).catch((err) => {
                            console.error(err);
                        });
                });
            });
    });

    app.post('/follow', (req, res) => {
        User.findById(req.user._id)
            .then((user) => {
                user.following.addToSet(req.body.user);
                user.save().then((user) => {
                    User.findById(req.body.user)
                        .then((user2) => {
                            user2.followers.addToSet(req.user._id);
                            user2.save().then((user2) => {
                                console.log("User:", user._id, "followed user:", req.body.user);
                                return res.status(200).send({
                                    user
                                });
                            }).catch((err) => {
                                console.error(err);
                                return res.status(400).send({
                                    err: err
                                });
                            });
                        })
                })
            })
    })
}
