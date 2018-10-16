const Song = require('../models/song.js');
const spotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const spotifyAPI = new spotifyWebApi({
    clientId: '5bba4ba0e80648da9e557f9cddafe6cf',
    clientSecret: SPOTIFY_SECRET
});

spotifyAPI.clientCredentialsGrant().then(
    (data) => {
        console.log('The access token is ' + data.body['access_token']);
        spotifyAPI.setAccessToken(data.body['access_token']);
    },
    function(err) {
        console.log('Something went wrong!', err);
    }
);

module.exports = (app) => {
    app.get('/', (req, res) => {
        let currentUser = req.user;

        // Find all songs with global privacy, grab the songID and sort by the date created
        Song.find({
                privacy: 0
            }).sort('-_id')
            .then((data) => {
                // With the data extract the song IDs
                const songIDs = [];
                for (const val of data) {
                    songIDs.push(val['spotifySongID']);
                }
                // Grab tracks with id via spotifyAPI
                spotifyAPI.getTracks(songIDs)
                    .then((songs) => {
                        res.render('home', {
                            songs: songs.body.tracks,
                            currentUser
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
                    userID: req.cookies,
                    song: data.body
                });
            }, (err) => {
                console.error(err);
            });
    })

    app.post('/share', (req, res) => {
        if (req.user) {
            Song.create(req.body).then((song) => {
                console.log("Created:", req.body.spotifySongID);
                res.redirect('/');
            }).catch((err) => {
                console.error(err);
            });
        } else {
            return res.status(401);
        }
    });

    app.delete('/share/:spotifySongID', (req, res) => {
        console.log("Trying to delete song with spotifySongID:", req.params.spotifySongID);
        Song.deleteOne({
                spotifySongID: req.params.spotifySongID
            })
            .then((song) => {
                if (song.n == 1) {
                    console.log("Destroyed:", req.params.spotifySongID);
                }
                res.status(200).send(song);
            }).catch((err) => {
                res.status(400).send(err);
            })
    })
};
