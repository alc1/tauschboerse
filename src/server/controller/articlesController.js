'use strict';

const articlesStore = require('../services/articlesStorage');
const categoriesStore = require('../services/categoriesStorage');
const usersStore = require('../services/usersStorage');

const articleCreator = require('./articleCreator');
const articleUpdater = require('./articleUpdater');

async function getArticlesByUser(req, res) {
    const { userId } = req.params;
    const articles = await articlesStore.getArticlesByUser(userId);
    for (let article of articles) {
        await fetchArticleDetails(article);
    }
    res.json({ articles : articles || [] });
}

async function getArticle(req, res) {
    const { articleId } = req.params;
    const article = await articlesStore.getArticle(articleId);
    if (article) {
        await fetchArticleDetails(article);
    }
    res.json({ article : article || {} });
}

async function fetchArticleDetails(theArticle) {
    const user = await usersStore.getUserById(theArticle.userId);
    addUserDetailsToArticle(theArticle, user);

    const categories = await categoriesStore.getCategories(theArticle.categories);
    addCategoriesToArticle(theArticle, categories);
}

function addUserDetailsToArticle(theArticle, theUser) {
    delete theArticle.userId;
    theArticle.user = {
        _id: theUser._id,
        name : theUser.name
    };
}

function addCategoriesToArticle(theArticle, theCategories) {
    theArticle.categories = theCategories;
}

async function createArticle(req, res) {
    const { article } = req.body;
    article.userId = req.user._id;
    const result = await articleCreator.create(article);
    if (result.success) {
        await fetchArticleDetails(result.article);
        res.json({ article: result.article });
    }
    else {
        res.status(result.status).json({ errors: result.errors });
    }
}

async function updateArticle(req, res) {
    const { articleId } = req.params;
    const { article } = req.body;
    const result = await articleUpdater.update(articleId, article);
    if (result.success) {
        await getArticle(req, res);
    }
    else {
        res.status(result.status).json({ errors: result.errors });
    }
}

module.exports = {
    getArticlesByUser,
    getArticle,
    createArticle,
    updateArticle
};
