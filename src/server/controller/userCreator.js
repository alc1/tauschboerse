'use strict';

const registrationValidator = require('../../shared/validations/registration');
const usersStore = require('../services/usersStorage');

async function create(theCredentials) {
    const validationError = checkCredentials(theCredentials);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    const existingUser = await usersStore.getUserByEmail(theCredentials.email);
    if (existingUser) {
        return {
            success: false,
            status: 400,
            errors: {
                email: 'Diese E-Mail existiert bereits'
            }
        };
    }

    const createdUser = await usersStore.createUser(theCredentials);
    if (!createdUser) {
        const error = 'Benutzer konnte nicht erstellt werden';
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

    return {
        success: true
    };
}

function checkCredentials(theCredentials) {
    const validation = registrationValidator.validate(theCredentials);
    if (!validation.isValid) {
        return {
            status: 400,
            errors: validation.errors
        };
    }
    return null;
}

module.exports = { create };
