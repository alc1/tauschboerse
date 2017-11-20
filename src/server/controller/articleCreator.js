'use strict';

const articleCreatorValidator = require('./articleCreatorValidator');
const articlesStore = require('../services/articlesStorage');

async function create(theArticle) {
    const validation = articleCreatorValidator.validate(theArticle);
    if (validation.success) {
        const createdArticle = await articlesStore.createArticle(theArticle);
        if (!createdArticle) {
            return {
                success: false,
                status: 500,
                globalError: 'Artikel konnte nicht erstellt werden!'
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
