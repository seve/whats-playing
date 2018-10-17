const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.get('/signup', (req, res) => {
        res.render('signup', {
            action: 'Sign Up'
        });
    });

    app.post('/signup', (req, res) => {
        const user = new User(req.body);

        user.save().then((user) => {
            const token = jwt.sign({
                _id: user._id
            }, process.env.HASH_SECRET, {
                expiresIn: "60 days"
            });
            res.cookie('whatsPlayingToken', token, {
                maxAge: 900000,
                httpOnly: true
            });
            res.redirect('/');
        }).catch((err) => {
            console.error(err);
            return res.status(400).send({
                err: err
            });
        });
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('whatsPlayingToken');
        res.redirect('/');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    })

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({
            username
        }, 'username password').then((user) => {
            if (!user) {
                return res.status(401).send({
                    message: 'Wrong username or password'
                });
            }

            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch) {
                    return res.status(401).send({
                        message: 'Wrong username or password'
                    });
                }

                const token = jwt.sign({
                        _id: user._id,
                        username: user.username
                    },
                    process.env.HASH_SECRET, {
                        expiresIn: "60 days"
                    }
                );

                res.cookie('whatsPlayingToken', token, {
                    maxAge: 900000,
                    httpOnly: true
                });
                console.log("User signed in:", user._id);
                res.redirect('/');
            });
        }).catch((err) => {
            console.error(err);
        });
    });

    app.get('/edit-profile/:id', (req, res) => {
        let currentUser = req.user;
        if (req.params.id == currentUser._id) {
            User.findById(currentUser._id).then((user) => {
                res.render('signup', {
                    currentUser: user,
                    action: 'Save Changes'
                });
            })
        } else {
            console.error("User:", currentUser._id, "attempted to edit", req.params.id);
            res.status(401);
        }
    });

    app.post('/edit-profile', (req, res) => {
        let currentUser = req.user;
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        console.log(username, password, email);

        res.clearCookie('whatsPlayingToken');
        // TODO: Find how to this properly (non-depricated)
        User.findOneAndUpdate( currentUser._id , {
                username: username,
                password: password,
                email: email
            }).then((user) => {
            const token = jwt.sign({
                _id: user._id
            }, process.env.HASH_SECRET, {
                expiresIn: "60 days"
            });
            res.cookie('whatsPlayingToken', token, {
                maxAge: 900000,
                httpOnly: true
            });
            res.redirect('/');
        }).catch((err) => {
            console.error(err);
            return res.status(400).send({
                err: err
            });
        });
    });
};
