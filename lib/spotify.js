const spotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

const spotifyAPI = new spotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
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

module.exports = spotifyAPI;
