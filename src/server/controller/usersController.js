'use strict';

const registrationValidator = require('../../shared/validations/registration');
const usersStore = require('../services/usersStorage');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function getAllUsers(req, res) {
    const users = await usersStore.getAllUsers();
    res.json({ users : users || [] });
}

async function getUser(req, res) {
    const { userId } = req.params;
    const user = await usersStore.getUser(userId);
    res.json({ user : user || {} });
}

async function login(req, res) {
    const { email, password } = req.body.credentials;
    const user = await usersStore.getUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email
        }, config.jwtSecret, { expiresIn: '1h' });
        res.json({ token: token });
    }
    else {
        res.status(401).json({ errors: { email: 'E-Mail oder Passwort unbekannt', password: 'E-Mail oder Passwort unbekannt' }});
    }
}

async function createUser(req, res) {
    const { credentials } = req.body;
    const validation = registrationValidator.validate(credentials);
    if (validation.isValid) {
        const user = await usersStore.getUserByEmail(credentials.email);
        if (!user) {
            const createdUser = await usersStore.createUser(credentials);
            if (createdUser) {
                await login(req, res);
            }
            else {
                const error = 'Benutzer konnte nicht erstellt werden';
                res.status(500).json({ errors: { name: error, email: error, password: error, passwordConfirmation: error } });
            }
        }
        else {
            res.status(400).json({ errors: { email: 'Diese E-Mail existiert bereits' } });
        }
    }
    else {
        res.status(400).json({ errors: validation.errors });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    login,
    createUser
};
