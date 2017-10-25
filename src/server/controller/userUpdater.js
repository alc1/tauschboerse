'use strict';

const userDetailsValidator = require('../../shared/validations/userDetails');
const usersStore = require('../services/usersStorage');
const bcrypt = require('bcrypt');

async function update(theUserId, theCredentials) {
    const validationError = checkCredentials(theCredentials);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    const user = await usersStore.getUserById(theUserId);
    const userCheckError = checkUser(user);
    if (userCheckError) {
        return {
            success: false,
            status: userCheckError.status,
            errors: userCheckError.errors
        };
    }

    const isAboutToChangePassword = !!theCredentials.oldPassword || !!theCredentials.password || !!theCredentials.passwordConfirmation;
    const passwordCheckError = checkPassword(isAboutToChangePassword, theCredentials, user);
    if (passwordCheckError) {
        return {
            success: false,
            status: passwordCheckError.status,
            errors: passwordCheckError.errors
        };
    }

    const isAboutToChangeEmail = user.email !== theCredentials.email;
    const emailCheckError = await checkEmail(isAboutToChangeEmail, theCredentials.email);
    if (emailCheckError) {
        return {
            success: false,
            status: emailCheckError.status,
            errors: emailCheckError.errors
        };
    }

    const userDetails = {
        email: theCredentials.email,
        name: theCredentials.name,
    };
    if (isAboutToChangePassword) {
        userDetails.password = bcrypt.hashSync(theCredentials.password, 10);
    }
    const numUpdated = await usersStore.updateUser(theUserId, userDetails);
    if (numUpdated === 1) {
        return {
            success: true,
            credentials: {
                userId: theUserId,
                email: theCredentials.email,
                name: theCredentials.name
            }
        };
    }
    const error = 'Benutzer konnte nicht aktualisiert werden';
    return {
        success: false,
        status: 500,
        errors: {
            name: error,
            email: error,
            password: error,
            passwordConfirmation: error
        }
    };
}

function checkCredentials(theCredentials) {
    const validation = userDetailsValidator.validate(theCredentials);
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
    if (isAboutToChangePassword && !bcrypt.compareSync(theCredentials.oldPassword, theUser.password)) {
        return {
            status: 401,
            errors: {
                oldPassword: 'Das bisherige Passwort ist falsch'
            }
        };
    }
    return null;
}

async function checkEmail(isAboutToChangeEmail, theNewEmail) {
    if (isAboutToChangeEmail) {
        const existingUser = await usersStore.getUserByEmail(theNewEmail);
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

module.exports = { update };
