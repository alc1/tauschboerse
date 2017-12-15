'use strict';

const jwt = require('jsonwebtoken');

const userCreatorValidator = require('./userCreatorValidator');
const userUpdaterValidator = require('./userUpdaterValidator');
const encryptionUtils = require('../utils/encryptionUtils');

const dataCache = require('../services/DataCache').dataCache;

function getAllUsers(req, res) {
    res.json({ users: dataCache.getAllUsers() || [] });
}

function getUserById(req, res) {
    const { userId } = req.params;
    const user = dataCache.getUserById(userId);
    if (user) {
        res.json({ user });
    }
    else {
        res.status(404).json({ globalError: `Benutzer [${userId}] nicht gefunden` });
    }
}

function login(req, res) {
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

function createUser(req, res) {
    const { user } = req.body;
    const validation = userCreatorValidator.validate(user);
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

function updateUser(req, res) {
    const { userId } = req.params;
    const { user } = req.body;
    const validation = userUpdaterValidator.validate(userId, user);
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
