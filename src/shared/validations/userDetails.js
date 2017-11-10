const validator = require('validator');
const lodash = require('lodash');

const isEmail = validator.isEmail;
const isEmpty = lodash.isEmpty;

function validate(theUser, theCredentials) {
    let errors = {};

    if (theUser) {
        if (isEmpty(theUser.name)) {
            errors.name = 'Der Name ist obligatorisch';
        }
        if (isEmpty(theUser.email)) {
            errors.email = 'Die E-Mail ist obligatorisch';
        }
        else {
            if (!isEmail(theUser.email)) {
                errors.email = 'Ungültige E-Mail';
            }
        }
    }
    else {
        errors.name = 'Der Name ist obligatorisch';
        errors.email = 'Die E-Mail ist obligatorisch';
    }

    if (theCredentials) {
        const isAboutToChangePassword = !isEmpty(theCredentials.currentPassword) || !isEmpty(theCredentials.newPassword) || !isEmpty(theCredentials.passwordConfirmation);
        if (isAboutToChangePassword) {
            if (isEmpty(theCredentials.currentPassword)) {
                errors.currentPassword = 'Das bisherige Passwort ist obligatorisch';
            }
            if (isEmpty(theCredentials.newPassword)) {
                errors.newPassword = 'Das Passwort ist obligatorisch';
            }
            if (isEmpty(theCredentials.passwordConfirmation)) {
                errors.passwordConfirmation = 'Die Passwortbestätigung ist obligatorisch';
            }
            if (theCredentials.newPassword !== theCredentials.passwordConfirmation) {
                errors.passwordConfirmation = 'Die Passwortbestätigung stimmt nicht überein';
            }
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { validate };
