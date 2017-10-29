'use strict';

const articleDetailsValidator = require('../../shared/validations/articleDetails');
const articlesStore = require('../services/articlesStorage');

async function update(theArticleId, theArticleDetails) {
    const validationError = checkArticle(theArticleDetails);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    const numUpdated = await articlesStore.updateArticle(theArticleId, theArticleDetails);
    if (numUpdated === 1) {
        return {
            success: true
        };
    }
    const error = 'Artikel konnte nicht aktualisiert werden';
    return {
        success: false,
        status: 500,
        errors: {
            title: error,
            description: error
        }
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

module.exports = { update };
