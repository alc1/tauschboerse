'use strict';

const articlesStore = require('../services/articlesStorage');
const usersStore = require('../services/usersStorage');

function getArticlesByUser(req, res) {
    const userId = req.params.userId;
    articlesStore.getArticlesByUser(userId, (err, articles) => {
        usersStore.getUser(userId, (err, user) => {
            articles.forEach((article) => {
                addUserDetailsToArticle(article, user);
            });
            res.json({ articles : articles || [] });
        });
    });
}

function getArticle(req, res) {
    const articleId = req.params.articleId;
    articlesStore.getArticle(articleId, (err, article) => {
        usersStore.getUser(article.userId, (err, user) => {
            addUserDetailsToArticle(article, user);
            res.json({ article : article || {} });
        });
    });
}

function addUserDetailsToArticle(theArticle, theUser) {
    delete theArticle.userId;
    theArticle.user = {
        _id: theUser._id,
        name : theUser.name
    };
}

module.exports = {
    getArticlesByUser,
    getArticle
};
