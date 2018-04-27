const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validate = require('validator');

exports.create = (req, res) => {
    let user = new User(req.body);
    const payload = {
        admin: user.admin,
        id: user._id
    };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 86400 });
    user.token = token;

    if(!validate.isEmail(user.email))
        res.send({ message: 'Email is incorrect' });
    //check if email exists in the db
    User.findOne({ email: user.email}, (err, doc) => {
        if (doc) {
            res.send({ message: `User with email ${user.email} already exist` });
        } else {
            user.save((err, user) => {
                if (err) res.send({ message: `Error creating user` });
                res.send(user);
            });
        }
    });
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) res.status(500).send({ message: `Cannot find user with email: ${req.body.email}` });
        if (!user) res.status(404).send('No user found.');
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err || isMatch === false) res.status(500).send({ message: `You cannot login` });
            const token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            user.token = token;
            res.send(user);
        });
    });
};

exports.findAll =  (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.find({}, (err, users) => {
            if (err) res.status(500).json({ message: 'Cannot retrieve users' });
            if (!users) return res.status(404).send("No users found.");

            res.json(users);
        });
    });

};

exports.findOne = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(req.params.userId).populate('notes').exec((err, user) => {
            if (err) res.status(500).send({ message: 'Cannot retrieve user' });
            res.send(user);
        });
    });
};

exports.update = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(req.params.userId, (err, user) => {
            if (err) res.status(500).send({ message: 'Cannot retrieve user' });
            user.username = req.body.username;
            user.email = req.body.email;

            user.save((err, user) => {
                if (err) res.status(500).send({ message: 'Cannot update a user' });
                res.send(user);
            });
        });
    });
};

exports.delete = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.remove({ _id: req.params.userId }, (err, user) => {
            if (err) res.status(500).send({ message: 'Cannot delete this user' });
            res.send({ message: 'User deleted' });
        })
    });
};

