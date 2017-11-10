'use strict';

const userCreatorValidator = require('./userCreatorValidator');

const usersStore = require('../services/usersStorage');

async function create(theUser, theCredentials) {
    const validation = await userCreatorValidator.validate(theUser, theCredentials);
    if (validation.success) {
        const createdUser = await usersStore.createUser(theUser, theCredentials);
        if (!createdUser) {
            const error = 'Benutzer konnte nicht erstellt werden';
            return {
                success: false,
                status: 500,
                errors: {
                    name: error,
                    email: error,
                    newPassword: error,
                    passwordConfirmation: error
                }
            };
        }
        return {
            success: true
        };
    }
    else {
        return validation;
    }
}

module.exports = { create };
