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

module.exports = spotifyAPI;
