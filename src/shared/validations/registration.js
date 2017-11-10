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
    else {
        errors.newPassword = 'Das Passwort ist obligatorisch';
        errors.passwordConfirmation = 'Die Passwortbestätigung ist obligatorisch';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { validate };
