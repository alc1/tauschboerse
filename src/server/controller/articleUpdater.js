'use strict';

const articleUpdaterValidator = require('./articleUpdaterValidator');
const articlesStore = require('../services/articlesStorage');

async function update(theArticleId, theArticle) {
    const validation = articleUpdaterValidator.validate(theArticleId, theArticle);
    if (validation.success) {
        const numUpdated = await articlesStore.updateArticle(theArticleId, theArticle);
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
    else {
        return validation;
    }
}

module.exports = { update };
