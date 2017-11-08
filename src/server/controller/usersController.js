'use strict';

const usersStore = require('../services/usersStorage');
const userCreator = require('./userCreator');
const userUpdater = require('./userUpdater');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;
const UserCache = require('../services/UserCache').UserCache;

async function getAllUsers(req, res) {
    if (useDataCache) {
        res.json({ users: dataCache.getAllUsers() || [] });
    }
    else {
        const users = await usersStore.getAllUsers();
        res.json({ users: users || [] });
    }
}

async function getUserById(req, res) {
    if (useDataCache) {
        const { userId } = req.params;
        res.json({ user: dataCache.getUserById(userId) || {} });
    }
    else {
        const { userId } = req.params;
        const user = await usersStore.getUserById(userId);
        res.json({ user: user || {} });
    }
}

async function login(req, res) {
    if (useDataCache) {
        const { email, password } = req.body.credentials;
        const acceptedUser = dataCache.authenticateUser(email, password);
        if (acceptedUser) {
            res.json({ token: createToken(acceptedUser._id, acceptedUser.name, acceptedUser.email) });
        }
        else {
            res.status(401).json({
                errors: {
                    email: 'E-Mail oder Passwort unbekannt',
                    password: 'E-Mail oder Passwort unbekannt'
                }
            });
        }
    }
    else {
        const { email, password } = req.body.credentials;
        const user = await usersStore.getUserByEmail(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            res.json({ token: createToken(user._id, user.name, user.email) });
        }
        else {
            res.status(401).json({
                errors: {
                    email: 'E-Mail oder Passwort unbekannt',
                    password: 'E-Mail oder Passwort unbekannt'
                }
            });
        }
    }
}

async function createUser(req, res) {
    if (useDataCache) {
        const { credentials } = req.body;

        let preparedUser = dataCache.prepareUser(credentials);
        dataCache.saveUser(preparedUser).then(
            user => login(req, res)
        );
    }
    else {
        const { credentials } = req.body;
        const result = await userCreator.create(credentials);
        if (result.success) {
            await login(req, res);
        }
        else {
            res.status(result.status).json({ errors: result.errors });
        }
    }
}

async function updateUser(req, res) {
    if (useDataCache) {
        const { userId } = req.params;
        const { credentials } = req.body;

        let preparedUser = dataCache.prepareUser(credentials);
        dataCache.saveUser(preparedUser).then(
            user => res.json({ token: createToken(user._id, user.name, user.email) })
        );
    }
    else {
        const { userId } = req.params;
        const { credentials } = req.body;
        const result = await userUpdater.update(userId, credentials);
        if (result.success) {
            res.json({ token: createToken(result.credentials.userId, result.credentials.name, result.credentials.email) });
        }
        else {
            res.status(result.status).json({ errors: result.errors });
        }
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
