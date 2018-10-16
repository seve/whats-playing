const Song = require('../models/song.js');

module.exports = (app, spotifyAPI) => {
    app.get('/', (req, res) => {
        // Find all songs with global privacy, grab the songID and sort by the date created
        Song.find({ privacy: 0 }).sort('-_id')
            .then((data) => {
                // With the data extract the song IDs
                const songIDs = [];
                for(const val of data) {
                    songIDs.push(val['spotifySongID']);
                }

                console.log("songIDs:", songIDs);
                // Grab tracks with id via spotifyAPI
                spotifyAPI.getTracks(songIDs)
                    .then((songs) => {
                        res.render('home', {
                            songs: songs.body.tracks
                        })
                    }, (err) => {
                        console.error(err);
                        res.render('home')
                    })
            })
    });

    app.get('/search', (req, res) => {
        console.log(req.query.term);
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
        Song.create(req.body).then((song) => {
            console.log("Shared song:", req.body.spotifySongID);
            res.redirect('/');
        }).catch((err) => {
            console.error(err);
        });
    });
};
