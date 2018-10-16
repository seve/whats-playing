require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const spotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.static('public'));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/whats-playing', { useNewUrlParser: true });

const PORT = process.env.PORT || 3000;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const song = require('./controllers/song.js');

const spotifyAPI = new spotifyWebApi({
    clientId: '5bba4ba0e80648da9e557f9cddafe6cf',
    clientSecret: SPOTIFY_SECRET
});

spotifyAPI.clientCredentialsGrant().then(
  (data) => {
    console.log('The access token is ' + data.body['access_token']);
    spotifyAPI.setAccessToken(data.body['access_token']);
    song(app, spotifyAPI);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);




app.listen(3000, () => {
    console.log('Listening on port: ' + PORT);
})
