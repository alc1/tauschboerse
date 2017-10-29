'use strict';

const articleDetailsValidator = require('../../shared/validations/articleDetails');
const articlesStore = require('../services/articlesStorage');

async function create(theArticle) {
    const validationError = checkArticle(theArticle);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    const createdArticle = await articlesStore.createArticle(theArticle);
    if (!createdArticle) {
        const error = 'Artikel konnte nicht erstellt werden';
        return {
            success: false,
            status: 500,
            errors: {
                title: error,
                description: error,
                categories: error
            }
        };
    }

    return {
        success: true,
        article: createdArticle
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

module.exports = { create };
