require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const app = express();
app.use(express.static('public'));


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/whats-playing', { useNewUrlParser: true });

const PORT = process.env.PORT || 3000;

const song = require('./controllers/song.js');
const auth = require('./controllers/auth.js');

song(app);
auth(app);





app.listen(3000, () => {
    console.log('Listening on port: ' + PORT);
})
