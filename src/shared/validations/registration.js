const validator = require('validator');
const lodash = require('lodash');

const isEmail = validator.isEmail;
const isEmpty = lodash.isEmpty;

function validate(theUser) {
    let errors = {};

    if (theUser) {
        if (isEmpty(theUser.gender)) {
            errors.gender = 'Die Anrede ist obligatorisch';
        }
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

        if (isEmpty(theUser.newPassword)) {
            errors.newPassword = 'Das Passwort ist obligatorisch';
        }
        if (isEmpty(theUser.passwordConfirmation)) {
            errors.passwordConfirmation = 'Die Passwortbestätigung ist obligatorisch';
        }
        if (theUser.newPassword !== theUser.passwordConfirmation) {
            errors.passwordConfirmation = 'Die Passwortbestätigung stimmt nicht überein';
        }
    }
    else {
        errors.gender = 'Die Anrede ist obligatorisch';
        errors.name = 'Der Name ist obligatorisch';
        errors.email = 'Die E-Mail ist obligatorisch';
        errors.newPassword = 'Das Passwort ist obligatorisch';
        errors.passwordConfirmation = 'Die Passwortbestätigung ist obligatorisch';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { validate };
