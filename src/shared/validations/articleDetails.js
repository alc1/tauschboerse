const lodash = require('lodash');

const isEmpty = lodash.isEmpty;

function validate(theArticle) {
    let errors = {};

    if (theArticle) {
        if (isEmpty(theArticle.title)) {
            errors.title = 'Der Titel ist obligatorisch';
        }
    }
    else {
        errors.title = 'Der Titel ist obligatorisch';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { validate };
