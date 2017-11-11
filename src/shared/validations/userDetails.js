const validator = require('validator');
const lodash = require('lodash');

const isEmail = validator.isEmail;
const isEmpty = lodash.isEmpty;

function validate(theUser) {
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

        const isAboutToChangePassword = !isEmpty(theUser.currentPassword) || !isEmpty(theUser.newPassword) || !isEmpty(theUser.passwordConfirmation);
        if (isAboutToChangePassword) {
            if (isEmpty(theUser.currentPassword)) {
                errors.currentPassword = 'Das bisherige Passwort ist obligatorisch';
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
    }
    else {
        errors.name = 'Der Name ist obligatorisch';
        errors.email = 'Die E-Mail ist obligatorisch';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { validate };
