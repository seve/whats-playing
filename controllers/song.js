const Song = require('../models/song.js');
const User = require('../models/user.js');
const spotifyAPI = require('../lib/spotify');

module.exports = (app) => {
    app.get('/', (req, res) => {
        let currentUser = req.user;

        // Find all songs with global privacy, grab the songID and sort by the date created
        Song.find({
                privacy: 0
            }).sort('-_id').populate('userID')
            .then((data) => {
                // With the data extract the song IDs
                const songIDs = [];
                for (const val of data) {
                    songIDs.push(val['spotifySongID']);
                }
                // Grab tracks with id via spotifyAPI
                spotifyAPI.getTracks(songIDs)
                    .then((songs) => {
                        for (let i = 0; i < data.length; i++) {
                            songs.body.tracks[i].userID = data[i].userID;
                        }
                        res.render('home', {
                            songs: songs.body.tracks,
                            currentUser: currentUser,
                            helpers: {
                                ifEquals: function(arg1, arg2, options) {
                                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                                }
                            }
                        })
                    }, (err) => {
                        console.error(err);
                        res.render('home', {
                            currentUser
                        });
                    });
            });
    });

    app.get('/search', (req, res) => {
        console.log("Searching Spotify for", req.query.term);
        spotifyAPI.searchTracks(req.query.term)
            .then((data) => {
                res.render('songs', {
                    songs: data.body.tracks.items
                })
            }, (err) => console.error(err));
    });

    app.get('/share/:id', (req, res) => {
        spotifyAPI.getTrack(req.params.id)
            .then((data) => {
                res.render('share-form', {
                    song: data.body
                });
            }, (err) => {
                console.error(err);
            });
    })

    app.post('/share', (req, res) => {
        if (req.user) {
            const song = new Song(req.body);
            song.userID = req.user._id;
            song.save().then((song) => {
                return User.findById(req.user._id)
            }).then((user) => {
                user.shares.unshift(song);
                user.save();
                res.redirect('/');
            }).catch((err) => {
                console.error(err);
            });
        } else {
            return res.status(401);
        }
    });

    app.delete('/share', (req, res) => {
        console.log(req.user);
        if (req.user && req.user._id === req.query.userID) {
            console.log("User:", req.query.userID, "Trying to delete song with spotifySongID:", req.query.spotifySongID);
            Song.deleteOne({
                    spotifySongID: req.query.spotifySongID,
                    userID: req.query.userID
                })
                .then((song) => {
                    if (song.n == 1) {
                        console.log("Destroyed:", req.query.spotifySongID);
                    }
                    res.status(200).send(song);
                }).catch((err) => {
                    res.status(400).send(err);
                })
        } else {
            return res.status(401);
        }
    })
};
