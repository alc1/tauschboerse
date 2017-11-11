'use strict';

const usersStore = require('../services/usersStorage');
const userCreator = require('./userCreator');
const userCreatorValidator = require('./userCreatorValidator');
const userUpdater = require('./userUpdater');
const userUpdaterValidator = require('./userUpdaterValidator');
const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        const { user, credentials } = req.body;
        const passwordToCheck = (req.isNewUser) ? credentials.newPassword: credentials.currentPassword;
        const acceptedUser = dataCache.authenticateUser(user.email, passwordToCheck);
        if (acceptedUser) {
            res.json({ token: createToken(acceptedUser._id, acceptedUser.name, acceptedUser.email, acceptedUser.registration) });
        }
        else {
            res.status(401).json({
                errors: {
                    email: 'E-Mail oder Passwort unbekannt',
                    currentPassword: 'E-Mail oder Passwort unbekannt',
                    newPassword: 'E-Mail oder Passwort unbekannt'
                }
            });
        }
    }
    else {
        const { user, credentials } = req.body;
        const foundUser = await usersStore.getUserByEmail(user.email);
        const passwordToCheck = (req.isNewUser) ? credentials.newPassword: credentials.currentPassword;
        if (foundUser && bcrypt.compareSync(passwordToCheck, foundUser.password)) {
            res.json({ token: createToken(foundUser._id, foundUser.name, foundUser.email, foundUser.registration) });
        }
        else {
            res.status(401).json({
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
        const { user, credentials } = req.body;
        const userObject = {
            _id: user._id,
            email: user.email,
            name: user.name,
            registration: user.registration,
            currentPassword: credentials.currentPassword,
            newPassword: credentials.newPassword,
            passwordConfirmation: credentials.passwordConfirmation
        };

        const validation = await userCreatorValidator.validate(user, credentials);
        if (validation.success) {
            let preparedUser = dataCache.prepareUser(userObject);
            dataCache.saveUser(preparedUser).then(
                user => {
                    req.isNewUser = true;
                    return login(req, res);
                }
            );
        }
        else {
            res.status(validation.status).json({ errors: validation.errors });
        }
    }
    else {
        const { user, credentials } = req.body;
        const result = await userCreator.create(user, credentials);
        if (result.success) {
            req.isNewUser = true;
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
        const { user, credentials } = req.body;
        const userObject = {
            _id: user._id,
            email: user.email,
            name: user.name,
            registration: user.registration,
            currentPassword: credentials.currentPassword,
            newPassword: credentials.newPassword,
            passwordConfirmation: credentials.passwordConfirmation
        };

        const validation = await userUpdaterValidator.validate(userId, user, credentials);
        if (validation.success) {
            let preparedUser = dataCache.prepareUser(userObject);
            dataCache.saveUser(preparedUser).then(
                user => res.json({ token: createToken(user._id, user.name, user.email, user.registration) })
            );
        }
        else {
            res.status(validation.status).json({ errors: validation.errors });
        }
    }
    else {
        const { userId } = req.params;
        const { user, credentials } = req.body;
        const result = await userUpdater.update(userId, user, credentials);
        if (result.success) {
            res.json({ token: createToken(result.user.userId, result.user.name, result.user.email, result.user.registration) });
        }
        else {
            res.status(result.status).json({ errors: result.errors });
        }
    }
}

function createToken(theUserId, theName, theEmail, theRegistrationDate) {
    console.log(`Create token for user ID [${theUserId}], name [${theName}], email [${theEmail}], email [${theRegistrationDate}]`);
    return jwt.sign({
        _id: theUserId,
        name: theName,
        email: theEmail,
        registration: theRegistrationDate
    }, config.jwtSecret, { expiresIn: '1h' });
}

module.exports = {
    getAllUsers,
    getUserById,
    login,
    createUser,
    updateUser
};
