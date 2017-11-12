'use strict';

const articlesStore = require('../services/articlesStorage');
const categoriesStore = require('../services/categoriesStorage');
const usersStore = require('../services/usersStorage');

const articleCreator = require('./articleCreator');
const articleUpdater = require('./articleUpdater');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;
const ArticleCache = require('../services/ArticleCache').ArticleCache;

async function getArticlesByOwner(req, res) {
    if (useDataCache) {
        const { userId } = req.params;
        res.json({ articles: dataCache.getArticlesByOwner(userId) || [] });
    }
    else {
        const { userId } = req.params;
        const articles = await articlesStore.getArticlesByOwner(userId);
        for (let article of articles) {
            await fetchArticleDetails(article);
        }
        res.json({ articles: articles || [] });
    }
}

async function getArticleById(req, res) {
    if (useDataCache) {
        const { articleId } = req.params;
        res.json({ article: dataCache.getArticleById(articleId) || null });
    }
    else {
        const { articleId } = req.params;
        const article = await articlesStore.getArticleById(articleId);
        if (article) {
            await fetchArticleDetails(article);
        }
        res.json({ article: article || null });
    }
}

async function fetchArticleDetails(theArticle) {
    const user = await usersStore.getUserById(theArticle.ownerId);
    addUserDetailsToArticle(theArticle, user);

    const categories = await categoriesStore.getCategories(theArticle.categoryIds);
    addCategoriesToArticle(theArticle, categories);
}

function addUserDetailsToArticle(theArticle, theUser) {
    delete theArticle.ownerId;
    theArticle.owner = {
        _id: theUser._id,
        name : theUser.name
    };
}

function addCategoriesToArticle(theArticle, theCategories) {
    delete theArticle.categoryIds;
    theArticle.categories = theCategories;
}

async function createArticle(req, res) {
    if (useDataCache) {
        const { article } = req.body;
        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        dataCache.saveArticle(preparedArticle)
            .then(article => res.json({ article: article }))
            .catch(() => res.status(500).json({
                errors: {
                    title: 'Unbekannter Server-Fehler',
                    description: 'Unbekannter Server-Fehler',
                    categories: 'Unbekannter Server-Fehler'
                }
            }));
    }
    else {
        const { article } = req.body;
        article.owner = req.user;
        await createNewCategories(article);
        const result = await articleCreator.create(ArticleCache.toPhysicalRecord(article));
        if (result.success) {
            await fetchArticleDetails(result.article);
            res.json({ article: result.article });
        }
        else {
            res.status(result.status).json({ errors: result.errors });
        }
    }
}

async function updateArticle(req, res) {
    if (useDataCache) {
        const { articleId } = req.params;
        const { article } = req.body;
        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        dataCache.saveArticle(preparedArticle)
            .then(article => res.json({ article: article }))
            .catch(() => res.status(500).json({
                errors: {
                    title: 'Unbekannter Server-Fehler',
                    description: 'Unbekannter Server-Fehler',
                    categories: 'Unbekannter Server-Fehler'
                }
            }));
    }
    else {
        const { articleId } = req.params;
        const { article } = req.body;
        article.owner = req.user;
        await createNewCategories(article);
        const result = await articleUpdater.update(articleId, ArticleCache.toPhysicalRecord(article));
        if (result.success) {
            await getArticleById(req, res);
        }
        else {
            res.status(result.status).json({ errors: result.errors });
        }
    }
}

async function createNewCategories(theArticle) {
    if (useDataCache) {
        const existingCategories = theArticle.categories.filter(category => category.hasOwnProperty('_id'));
        const newCategories = theArticle.categories.filter(category => !category.hasOwnProperty('_id'));
        const allSaveRequests = newCategories.map(category => {
            const preparedCategory = dataCache.prepareCategory(category);
            return dataCache.saveCategory(preparedCategory);
        });
        const createdCategories = await Promise.all(allSaveRequests);
        theArticle.categories = [...existingCategories, ...createdCategories];

    }
    else {
        const existingCategories = theArticle.categories.filter(category => category.hasOwnProperty('_id'));
        const newCategories = theArticle.categories.filter(category => !category.hasOwnProperty('_id'));
        const allSaveRequests = newCategories.map(category => categoriesStore.createCategory(category));
        const createdCategories = await Promise.all(allSaveRequests);
        theArticle.categories = [...existingCategories, ...createdCategories];
    }
}

module.exports = {
    getArticlesByOwner,
    getArticleById,
    createArticle,
    updateArticle
};
