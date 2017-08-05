'use strict';

const articles = require('../services/articlesStorage');

function getUserArticles(req, res) {
    const userId = req.params.userId;
    articles.getUserArticles(userId, (err, articles) => {
        res.json({ articles : articles || [] });
    });
}

function getArticle(req, res) {
    const articleId = req.params.articleId;
    articles.getArticle(articleId, (err, article) => {
        res.json({ article : article || {} });
    });
}

module.exports = {
    getUserArticles,
    getArticle
};
