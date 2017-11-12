'use strict';

const articleDetailsValidator = require('../../shared/validations/articleDetails');

function validate(theArticleId, theArticle) {
    if (theArticleId !== theArticle._id) {
        return {
            status: 400,
            errors: {
                title: 'Artikel-ID ungültig',
                description: 'Artikel-ID ungültig',
                categories: 'Artikel-ID ungültig'
            }
        };
    }

    const validationError = checkArticle(theArticle);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    return {
        success: true
    };
}

function checkArticle(theArticle) {
    const validation = articleDetailsValidator.validate(theArticle);
    if (!validation.isValid) {
        return {
            status: 400,
            errors: validation.errors
        };
    }
    return null;
}

module.exports = { validate };
