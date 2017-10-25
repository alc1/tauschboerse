const validator = require('validator');
const lodash = require('lodash');

const isEmail = validator.isEmail;
const isEmpty = lodash.isEmpty;

function validate(theCredentials) {
    let errors = {};

    if (theCredentials) {
        if (isEmpty(theCredentials.name)) {
            errors.name = 'Der Name ist obligatorisch';
        }
        if (isEmpty(theCredentials.email)) {
            errors.email = 'Die E-Mail ist obligatorisch';
        }
        else {
            if (!isEmail(theCredentials.email)) {
                errors.email = 'Ungültige E-Mail';
            }
        }
        const isAboutToChangePassword = !isEmpty(theCredentials.oldPassword) || !isEmpty(theCredentials.password) || !isEmpty(theCredentials.passwordConfirmation);
        if (isAboutToChangePassword) {
            if (isEmpty(theCredentials.oldPassword)) {
                errors.oldPassword = 'Das bisherige Passwort ist obligatorisch';
            }
            if (isEmpty(theCredentials.password)) {
                errors.password = 'Das Passwort ist obligatorisch';
            }
            if (isEmpty(theCredentials.passwordConfirmation)) {
                errors.passwordConfirmation = 'Die Passwortbestätigung ist obligatorisch';
            }
            if (theCredentials.password !== theCredentials.passwordConfirmation) {
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
