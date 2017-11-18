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
        return {
            success: false,
            status: 500,
            globalError: 'Artikel konnte nicht aktualisiert werden!'
        };
    }
    else {
        return validation;
    }
}

module.exports = { update };
