'use strict';

const userUpdaterValidator = require('./userUpdaterValidator');

const usersStore = require('../services/usersStorage');
const encryptionUtils = require('../utils/encryptionUtils');

async function update(theUserId, theUser) {
    const validation = await userUpdaterValidator.validate(theUserId, theUser);
    if (validation.success) {
        const userDetails = {
            email: theUser.email,
            name: theUser.name,
            registration: new Date(theUser.registration)
        };
        const isAboutToChangePassword = !!theUser.currentPassword || !!theUser.newPassword || !!theUser.passwordConfirmation;
        if (isAboutToChangePassword) {
            userDetails.password = encryptionUtils.encrypt(theUser.newPassword);
        }
        const numUpdated = await usersStore.updateUser(theUserId, userDetails);
        if (numUpdated === 1) {
            return {
                success: true,
                user: {
                    userId: theUserId,
                    email: theUser.email,
                    name: theUser.name,
                    registration: theUser.registration
                }
            };
        }
        return {
            success: false,
            status: 500,
            globalError: 'Benutzer konnte nicht aktualisiert werden!'
        };
    }
    else {
        return validation;
    }
}

module.exports = { update };
