'use strict';

const userDetailsValidator = require('../../shared/validations/userDetails');
const usersStore = require('../services/usersStorage');
const bcrypt = require('bcrypt');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;

async function validate(theUserId, theUser, theCredentials) {
    if (theUserId !== theUser._id) {
        return {
            status: 400,
            errors: {
                email: 'Benutzer-ID ungültig'
            }
        };
    }

    const validationError = checkCredentials(theUser, theCredentials);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    let user;
    if (useDataCache) {
        user = dataCache.getUserById(theUserId);
    }
    else {
        user = await usersStore.getUserById(theUserId);
    }
    const userCheckError = checkUser(user);
    if (userCheckError) {
        return {
            success: false,
            status: userCheckError.status,
            errors: userCheckError.errors
        };
    }

    const isAboutToChangePassword = !!theCredentials.currentPassword || !!theCredentials.newPassword || !!theCredentials.passwordConfirmation;
    const passwordCheckError = checkPassword(isAboutToChangePassword, theCredentials, user);
    if (passwordCheckError) {
        return {
            success: false,
            status: passwordCheckError.status,
            errors: passwordCheckError.errors
        };
    }

    const isAboutToChangeEmail = user.email !== theUser.email;
    const emailCheckError = await checkEmail(isAboutToChangeEmail, theUser.email);
    if (emailCheckError) {
        return {
            success: false,
            status: emailCheckError.status,
            errors: emailCheckError.errors
        };
    }

    return {
        success: true
    };
}

function checkCredentials(theUser, theCredentials) {
    const validation = userDetailsValidator.validate(theUser, theCredentials);
    if (!validation.isValid) {
        return {
            status: 400,
            errors: validation.errors
        };
    }
    return null;
}

function checkUser(theUser) {
    if (!theUser) {
        return {
            status: 400,
            errors: {
                email: 'Benutzer nicht gefunden'
            }
        };
    }
    return null;
}

function checkPassword(isAboutToChangePassword, theCredentials, theUser) {
    if (isAboutToChangePassword && !bcrypt.compareSync(theCredentials.currentPassword, theUser.password)) {// TODO ALC: theUser.password is null in cache mode!
        return {
            status: 401,
            errors: {
                currentPassword: 'Das bisherige Passwort ist falsch'
            }
        };
    }
    return null;
}

async function checkEmail(isAboutToChangeEmail, theNewEmail) {
    if (isAboutToChangeEmail) {
        let existingUser;
        if (useDataCache) {
            existingUser = dataCache.getUserByEmail(theNewEmail);
        }
        else {
            existingUser = await usersStore.getUserByEmail(theNewEmail);
        }
        if (existingUser) {
            return {
                status: 400,
                errors: {
                    email: 'E-Mail existiert bereits'
                }
            };
        }
    }
    return null;
}

module.exports = { validate };
