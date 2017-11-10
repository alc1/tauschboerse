'use strict';

const userUpdaterValidator = require('./userUpdaterValidator');

const usersStore = require('../services/usersStorage');
const bcrypt = require('bcrypt');

async function update(theUserId, theUser, theCredentials) {
    const validation = await userUpdaterValidator.validate(theUserId, theUser, theCredentials);
    if (validation.success) {
        const userDetails = {
            email: theUser.email,
            name: theUser.name,
        };
        const isAboutToChangePassword = !!theCredentials.currentPassword || !!theCredentials.newPassword || !!theCredentials.passwordConfirmation;
        if (isAboutToChangePassword) {
            userDetails.password = bcrypt.hashSync(theCredentials.newPassword, 10);
        }
        const numUpdated = await usersStore.updateUser(theUserId, userDetails);
        if (numUpdated === 1) {
            return {
                success: true,
                user: {
                    userId: theUserId,
                    email: theUser.email,
                    name: theUser.name
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
                newPassword: error,
                passwordConfirmation: error
            }
        };
    }
    else {
        return validation;
    }
}

module.exports = { update };
