'use strict';

const articlesStore = require('../services/articlesStorage');
const categoriesStore = require('../services/categoriesStorage');
const usersStore = require('../services/usersStorage');

const articleCreator = require('./articleCreator');
const articleCreatorValidator = require('./articleCreatorValidator');
const articleUpdater = require('./articleUpdater');
const articleUpdaterValidator = require('./articleUpdaterValidator');

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
        const article = dataCache.getArticleById(articleId);
        if (article) {
            res.json({ article });
        }
        else {
            res.status(404).json({ globalError: `Artikel [${articleId}] nicht gefunden` });
        }
    }
    else {
        const { articleId } = req.params;
        const article = await articlesStore.getArticleById(articleId);
        if (article) {
            await fetchArticleDetails(article);
            res.json({ article });
        }
        else {
            res.status(404).json({ globalError: `Artikel [${articleId}] nicht gefunden` });
        }
    }
}

async function createArticle(req, res) {
    if (useDataCache) {
        const { article } = req.body;
        const validation = await articleCreatorValidator.validate(article);
        if (validation.success) {
            await createNewCategories(article);
            const preparedArticle = dataCache.prepareArticle(article, req.user);
            dataCache.saveArticle(preparedArticle)
                .then(article => res.json({article: article}))
                .catch(() => res.status(500).json({ globalError: 'Unbekannter Server-Fehler' }));
        }
        else {
            res.status(validation.status).json({ errors: validation.errors, globalError: validation.globalError });
        }
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
            res.status(result.status).json({ errors: result.errors, globalError: result.globalError });
        }
    }
}

async function updateArticle(req, res) {
    if (useDataCache) {
        const { articleId } = req.params;
        const { article } = req.body;
        const validation = await articleUpdaterValidator.validate(articleId, article);
        if (validation.success) {
            await createNewCategories(article);
            const preparedArticle = dataCache.prepareArticle(article, req.user);
            dataCache.saveArticle(preparedArticle)
                .then(article => res.json({ article: article }))
                .catch(() => res.status(500).json({ globalError: 'Unbekannter Server-Fehler' }));
        }
        else {
            res.status(validation.status).json({ errors: validation.errors, globalError: validation.globalError });
        }
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
            res.status(result.status).json({ errors: result.errors, globalError: result.globalError });
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

module.exports = {
    getArticlesByOwner,
    getArticleById,
    createArticle,
    updateArticle
};
