require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const spotifyWebApi = require('spotify-web-api-node');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3000;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const spotifyAPI = new spotifyWebApi({
    clientId: '5bba4ba0e80648da9e557f9cddafe6cf',
    clientSecret: SPOTIFY_SECRET
});
spotifyAPI.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    spotifyAPI.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

app.get('/', (req, res) => {
    const trackIds = ['35yZkNFNVosiHE6Uj0COVM', '7qU7vhCPKhkDiJYGoboISc', '33JMMgxQKL3zJsZeMNC3gR'];
    spotifyAPI.getTracks(trackIds)
    .then((data) => {
        console.log(data.body);
        res.render('home', { songs: data.body.tracks})
    },
    (err) => {
        console.error(err);
    });
});

app.listen(3000, () => {
    console.log('Listening on port: ' + PORT);
})
