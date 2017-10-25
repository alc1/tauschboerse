'use strict';

const articlesStore = require('../services/articlesStorage');
const categoriesStore = require('../services/categoriesStorage');
const usersStore = require('../services/usersStorage');

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
    await fetchArticleDetails(article);
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

module.exports = {
    getArticlesByUser,
    getArticle
};
