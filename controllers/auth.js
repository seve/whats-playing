const User = require('../models/user.js');

module.exports = (app) => {
    app.post('/signup', (req, res) => {
        const user = new User(req.body);

        user.save().then((user) => {
            res.redirect('/');
        }).catch((err) => {
            console.error(err);
        });
    });
};
