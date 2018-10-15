require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const spotifyWebApi = require('spotify-web-api-node');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

const spotifyAPI = new spotifyWebApi({
    clientId: '',
    clientSecret: '',
    redirectUri: ''
})

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('Listening on port: ' + PORT);
})
