'use strict';

const articlesStore = require('../services/articlesStorage');

function getArticlesByUser(req, res) {
    const userId = req.params.userId;
    articlesStore.getArticlesByUser(userId, (err, articles) => {
        res.json({ articles : articles || [] });
    });
}

function getArticle(req, res) {
    const articleId = req.params.articleId;
    articlesStore.getArticle(articleId, (err, article) => {
        res.json({ article : article || {} });
    });
}

module.exports = {
    getArticlesByUser,
    getArticle
};
