'use strict';

const registrationValidator = require('../../shared/validations/registration');
const usersStore = require('../services/usersStorage');
const userCreator = require('./userCreator');
const userUpdater = require('./userUpdater');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function getAllUsers(req, res) {
    const users = await usersStore.getAllUsers();
    res.json({ users : users || [] });
}

async function getUserById(req, res) {
    const { userId } = req.params;
    const user = await usersStore.getUserById(userId);
    res.json({ user : user || {} });
}

async function login(req, res) {
    const { email, password } = req.body.credentials;
    const user = await usersStore.getUserByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
            token: createToken(user._id, user.name, user.email)
        });
    }
    else {
        res.status(401).json({ errors: { email: 'E-Mail oder Passwort unbekannt', password: 'E-Mail oder Passwort unbekannt' }});
    }
}

async function createUser(req, res) {
    const { credentials } = req.body;
    const result = await userCreator.create(credentials);
    if (result.success) {
        await login(req, res);
    }
    else {
        res.status(result.status).json({ errors: result.errors });
    }
}

async function updateUser(req, res) {
    const { userId } = req.params;
    const { credentials } = req.body;
    const result = await userUpdater.update(userId, credentials);
    if (result.success) {
        res.json({
            token: createToken(result.credentials.userId, result.credentials.name, result.credentials.email)
        });
    }
    else {
        res.status(result.status).json({ errors: result.errors });
    }
}

function createToken(theUserId, theName, theEmail) {
    return jwt.sign({
        _id: theUserId,
        name: theName,
        email: theEmail
    }, config.jwtSecret, { expiresIn: '1h' });
}

module.exports = {
    getAllUsers,
    getUserById,
    login,
    createUser,
    updateUser
};
