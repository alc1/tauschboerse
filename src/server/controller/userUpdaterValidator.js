'use strict';

const userDetailsValidator = require('../../shared/validations/userDetails');
const usersStore = require('../services/usersStorage');
const encryptionUtils = require('../utils/encryptionUtils');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;

async function validate(theUserId, theUser) {
    if (theUserId !== theUser._id) {
        return {
            status: 400,
            globalError: 'Benutzer-ID ist ungültig!'
        };
    }

    const validationError = checkCredentials(theUser);
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

    let password;
    if (useDataCache) {
        password = dataCache.getPasswordByUserId(theUserId);
    }
    else {
        password = user.password;
    }
    const isAboutToChangePassword = !!theUser.currentPassword || !!theUser.newPassword || !!theUser.passwordConfirmation;
    const passwordCheckError = checkPassword(isAboutToChangePassword, theUser, password);
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

function checkCredentials(theUser) {
    const validation = userDetailsValidator.validate(theUser);
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

function checkPassword(isAboutToChangePassword, theUser, thePassword) {
    if (isAboutToChangePassword && !encryptionUtils.compare(theUser.currentPassword, thePassword)) {
        return {
            status: 400,
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
