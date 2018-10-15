require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const spotifyWebApi = require('spotify-web-api-node');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3000;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const song = require('./controllers/song.js');

const spotifyAPI = new spotifyWebApi({
    clientId: '5bba4ba0e80648da9e557f9cddafe6cf',
    clientSecret: SPOTIFY_SECRET
});

spotifyAPI.clientCredentialsGrant().then(
  function(data) {
    spotifyAPI.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);


song(app);


app.listen(3000, () => {
    console.log('Listening on port: ' + PORT);
})
