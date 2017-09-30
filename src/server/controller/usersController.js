'use strict';

const registrationValidator = require('../../shared/validations/registration');
const usersStore = require('../services/usersStorage');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function getUsers(req, res) {
    usersStore.getUsers((err, users) => {
        res.json({ users : users || [] });
    });
}

function getUser(req, res) {
    const { userId } = req.params;
    usersStore.getUser(userId, (err, user) => {
        res.json({ user : user || {} });
    });
}

function login(req, res) {
    const { email, password } = req.body.credentials;
    usersStore.login(email, (err, user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email
            }, config.jwtSecret, { expiresIn: '1h' });
            res.json({ token: token });
        }
        else {
            res.status(401).json({ errors: {email: 'Invalid credentials', password: 'Invalid credentials' }});
        }
    });
}

function createUser(req, res) {
    const { credentials } = req.body;
    const validation = registrationValidator.validate(credentials);
    if (validation.isValid) {
        usersStore.createUser(credentials, (err, newDoc) => {
            login(req, res);
        });
    }
    else {
        res.status(400).json({ errors: validation.errors });
    }
}

module.exports = {
    getUsers,
    getUser,
    login,
    createUser
};
