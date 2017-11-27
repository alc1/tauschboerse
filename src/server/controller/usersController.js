'use strict';

const jwt = require('jsonwebtoken');

const usersStore = require('../services/usersStorage');
const userCreator = require('./userCreator');
const userCreatorValidator = require('./userCreatorValidator');
const userUpdater = require('./userUpdater');
const userUpdaterValidator = require('./userUpdaterValidator');
const encryptionUtils = require('../utils/encryptionUtils');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;

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
        const user = dataCache.getUserById(userId);
        if (user) {
            res.json({ user });
        }
        else {
            res.status(404).json({ globalError: `Benutzer [${userId}] nicht gefunden` });
        }
    }
    else {
        const { userId } = req.params;
        const user = await usersStore.getUserById(userId);
        if (user) {
            res.json({ user });
        }
        else {
            res.status(404).json({ globalError: `Benutzer [${userId}] nicht gefunden` });
        }
    }
}

async function login(req, res) {
    if (useDataCache) {
        const { user } = req.body;
        const passwordToCheck = (req.isNewUser) ? user.newPassword: user.currentPassword;
        const acceptedUser = dataCache.authenticateUser(user.email, passwordToCheck);
        if (acceptedUser) {
            res.json({ token: createToken(acceptedUser._id, acceptedUser.name, acceptedUser.email, acceptedUser.registration) });
        }
        else {
            res.status(400).json({
                errors: {
                    email: 'E-Mail oder Passwort unbekannt',
                    currentPassword: 'E-Mail oder Passwort unbekannt',
                    newPassword: 'E-Mail oder Passwort unbekannt'
                }
            });
        }
    }
    else {
        const { user } = req.body;
        const foundUser = await usersStore.getUserByEmail(user.email);
        const passwordToCheck = (req.isNewUser) ? user.newPassword: user.currentPassword;
        if (foundUser && encryptionUtils.compare(passwordToCheck, foundUser.password)) {
            res.json({ token: createToken(foundUser._id, foundUser.name, foundUser.email, foundUser.registration) });
        }
        else {
            res.status(400).json({
                errors: {
                    email: 'E-Mail oder Passwort unbekannt',
                    currentPassword: 'E-Mail oder Passwort unbekannt',
                    newPassword: 'E-Mail oder Passwort unbekannt'
                }
            });
        }
    }
}

async function createUser(req, res) {
    if (useDataCache) {
        const { user } = req.body;
        const validation = await userCreatorValidator.validate(user);
        if (validation.success) {
            const preparedUser = dataCache.prepareUser(user);
            dataCache.saveUser(preparedUser)
                .then(() => {
                    req.isNewUser = true;
                    return login(req, res);
                })
                .catch(() => res.status(500).json({ globalError: 'Unbekannter Server-Fehler' }));
        }
        else {
            res.status(validation.status).json({ errors: validation.errors });
        }
    }
    else {
        const { user } = req.body;
        const result = await userCreator.create(user);
        if (result.success) {
            req.isNewUser = true;
            await login(req, res);
        }
        else {
            res.status(result.status).json({ errors: result.errors, globalError: result.globalError });
        }
    }
}

async function updateUser(req, res) {
    if (useDataCache) {
        const { userId } = req.params;
        const { user } = req.body;
        const validation = await userUpdaterValidator.validate(userId, user);
        if (validation.success) {
            const preparedUser = dataCache.prepareUser(user);
            dataCache.saveUser(preparedUser)
                .then(user => res.json({ token: createToken(user._id, user.name, user.email, user.registration) }))
                .catch(() => res.status(500).json({ globalError: 'Unbekannter Server-Fehler' }));
        }
        else {
            res.status(validation.status).json({ errors: validation.errors, globalError: validation.globalError });
        }
    }
    else {
        const { userId } = req.params;
        const { user } = req.body;
        const result = await userUpdater.update(userId, user);
        if (result.success) {
            res.json({ token: createToken(result.user.userId, result.user.name, result.user.email, result.user.registration) });
        }
        else {
            res.status(result.status).json({ errors: result.errors, globalError: result.globalError });
        }
    }
}

function createToken(theUserId, theName, theEmail, theRegistrationDate) {
    console.log(`Create token for user ID [${theUserId}], name [${theName}], email [${theEmail}], registration [${theRegistrationDate}]`);
    return jwt.sign({
        _id: theUserId,
        name: theName,
        email: theEmail,
        registration: theRegistrationDate
    }, process.env.JWT_KEY, { expiresIn: '1h' });
}

module.exports = {
    getAllUsers,
    getUserById,
    login,
    createUser,
    updateUser
};
