'use strict';

const articleCreatorValidator = require('./articleCreatorValidator');
const articlesStore = require('../services/articlesStorage');

async function create(theArticle) {
    const validation = articleCreatorValidator.validate(theArticle);
    if (validation.success) {
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
    else {
        return validation;
    }
}

module.exports = { create };
