const Song = require('../models/song.js');
const User = require('../models/user.js');
const spotifyAPI = require('../lib/spotify');

module.exports = (app) => {
    app.get('/', (req, res) => {
        let currentUser = req.user;

        let followedUsers = [];

        let globalSongData = [];
        let followingSongData = [];
        let personalSongData = [];

        let songPromises = [];

        // Only find this info if logged in
        if (currentUser) {
            // Grab the user's info population their followed users and that users shares
            songPromises.push(User.findById(currentUser._id)
                .populate({
                    path: 'following',
                    populate: {
                        path: 'shares'
                    }
                })
                .then((user) => {
                    followedUsers = user.following;
                    // Grab the shared songs from followedUser and put them into an array
                    followingSongData = followedUsers.reduce((result, user) => {
                        if (user.shares[0]) {
                            result.push(...user.shares);
                        }
                        return result;
                    }, []);

                    // Remove any private shares
                    followingSongData = followingSongData.filter((song) => {
                        if(song.privacy == 2) {
                            return false;
                        }
                        return true;
                    })

                    // Sort that array by _id (creation)
                    followingSongData.sort((a, b) => {
                        return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);
                    });

                }).catch((err) => {
                    console.log("Error looking up followed users", err);
                }))

            // Grab songs where current user is mentioned
            songPromises.push(Song.find({
                    mentionID: currentUser._id
                }).sort('-_id')
                .populate('userID')
                .populate('mentionID')
                .then((data) => {
                    personalSongData = data;
                })
                .catch((err) => {
                    console.error(err);
                }));
        }
        // Find all songs with global privacy, populate the songID and mentionID, and sort by the date created
        songPromises.push(Song.find({
                privacy: 0
            }).sort('-_id')
            .populate('userID')
            .populate('mentionID')
            .then((data) => {
                globalSongData = data;
            })
            .catch((err) => {
                console.error(err);
            }));

        let allSongData = [];

        // Wait for all database queries to be completed
        Promise.all(songPromises).then(() => {
            console.log("============================");
            console.log("FOLLOWING SONG DATA:", followingSongData)
            console.log("============================");
            console.log("GLOBAL SONG DATA:", globalSongData);
            console.log("============================");
            console.log("PERSONAL SONG DATA:", personalSongData);
            console.log("============================");

            allSongData = followingSongData.concat(globalSongData, personalSongData);

            // With the data extract the song IDs
            const songIDs = allSongData.map(a => a.spotifySongID);
            // Grab tracks with id via spotifyAPI
            spotifyAPI.getTracks(songIDs)
                .then((songs) => {
                    let globalSongs = [];
                    let followingSongs = [];
                    let personalSongs = [];
                    for (let i = 0; i < allSongData.length; i++) {
                        // Append backend data to songs
                        songs.body.tracks[i].user = allSongData[i].userID;
                        songs.body.tracks[i].mention = allSongData[i].mentionID;
                        songs.body.tracks[i].privacy = allSongData[i].privacy;

                        const followingLength = followingSongData.length;
                        const globalLength = globalSongData.length;

                        // Put songs in respective feeds
                        if (i < followingLength) {
                            followingSongs.push(songs.body.tracks[i]);
                        } else if (i < globalSongData.length + followingLength) {
                            globalSongs.push(songs.body.tracks[i]);
                        } else {
                            personalSongs.push(songs.body.tracks[i]);
                        }
                    }


                    res.render('home', {
                        followingSongs,
                        globalSongs,
                        personalSongs,
                        currentUser: currentUser,
                        profile: false,
                    });
                }).catch((err) => {
                    console.error(err);
                    res.render('home', {
                        // followingSongs,
                        // globalSongs,
                        // personalSongs,
                        currentUser: currentUser,
                        profile: false,
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
            console.log("User:", req.query.userID, "tried to delete song with spotifySongID:", req.query.spotifySongID);
            return res.status(401);
        }
    })
};
