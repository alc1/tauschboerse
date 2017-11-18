'use strict';

const userCreatorValidator = require('./userCreatorValidator');

const usersStore = require('../services/usersStorage');

async function create(theUser) {
    const validation = await userCreatorValidator.validate(theUser);
    if (validation.success) {
        const createdUser = await usersStore.createUser(theUser);
        if (!createdUser) {
            return {
                success: false,
                status: 500,
                globalError: 'Benutzer konnte nicht erstellt werden!'
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
