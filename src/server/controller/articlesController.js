'use strict';

const articleCreatorValidator = require('./articleCreatorValidator');
const articleUpdaterValidator = require('./articleUpdaterValidator');

const photosController = require('./photosController');
const commonController = require('./commonController');

const ArticleStatus = require('../../shared/constants/ArticleStatus');
const TradeState = require('../../shared/constants/TradeState');
const Photo = require('../model/Photo');
const filterArticles = require('../../shared/filterArticles');

const ParameterValidationError = require('../utils/ParameterValidationError');

const dataCache = require('../services/DataCache').dataCache;

function getArticlesByOwner(req, res) {
    const { userId } = req.params;
    const { onlyAvailable } = req.query;

    let articles = dataCache.getArticlesByOwner(userId) || [];

    if (onlyAvailable === '1') {
        articles = articles.filter(article => (article.status === ArticleStatus.STATUS_FREE) || (article.status === ArticleStatus.STATUS_DEALING));
    }

    res.json({ articles: articles });
}

function getArticleById(req, res) {
    const { articleId } = req.params;
    const article = dataCache.getArticleById(articleId);
    if (article) {
        res.json({ article, trades: getTradesIfAllowed(req.user, articleId) });
    }
    else {
        res.status(404).json({ globalError: `Artikel [${articleId}] nicht gefunden` });
    }
}

async function deleteArticleById(req, res) {
    try {
        const { articleId } = req.params;

        // check article exists - we decided against allowing not-existing articles to be created this way
        const article = checkUserOwnsArticle(articleId, req.user._id, `Artikel [${articleId}] darf nicht gelöscht werden`);

        if (dataCache.isArticleUsed(article._id) && article.status !== ArticleStatus.STATUS_DEALED && article.status !== ArticleStatus.STATUS_DELETED) {
            let articleToSave = dataCache.prepareArticle(article, req.user);
            articleToSave.status = ArticleStatus.STATUS_DELETED;
            const savedArticle = await dataCache.saveArticle(articleToSave);
            if (savedArticle) {
                commonController.findAndFlagInvalidTrades([savedArticle]);
                res.json({ isDeleted: true, article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
            }
            else {
                throw new Error('Unbekannter Server-Fehler');
            }
        }
        else if (article.status === ArticleStatus.STATUS_FREE) {
            await dataCache.deleteArticleById(articleId);
            photosController.deleteAllPhotosForArticle(articleId);
            res.json({ isDeleted: true, articleId });
        }
        else {
            res.json({ isDeleted: false, articleId });
        }
    } catch(e) {
        handleError(e, res);
    }
}

async function createArticle(req, res) {
    const { article } = req.body;
    const validation = articleCreatorValidator.validate(article);
    if (validation.success) {
        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        const savedArticle = await dataCache.saveArticle(preparedArticle);
        if (savedArticle) {
            res.json({ article: savedArticle });
        }
        else {
            res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
        }
    }
    else {
        res.status(validation.status).json({ errors: validation.errors, globalError: validation.globalError });
    }
}

async function updateArticle(req, res) {
    try {
        const { articleId } = req.params;
        const { article } = req.body;

        // check article exists - we decided against allowing not-existing articles to be created this way
        checkUserOwnsArticle(articleId, req.user._id, `Artikel [${articleId}] darf nicht verändert werden`);

        // validate new values
        const validation = articleUpdaterValidator.validate(articleId, article);
        if (!validation.success) {
            throw new ParameterValidationError(validation.status, validation.globalError, validation.errors);
        }

        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        const savedArticle = await dataCache.saveArticle(preparedArticle);
        if (!savedArticle) {
            throw new ParameterValidationError(500, 'Unbekannter Server-Fehler');
        }

        // success
        res.json({ article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
    } catch(e) {
        handleError(e, res);
    }
}

function findArticles(req, res) {
    const { text } = req.query;

    // only available articles should be considered
    let allArticles = dataCache.getAllArticles().filter(a => (a.status !== ArticleStatus.STATUS_DEALED) && (a.status !== ArticleStatus.STATUS_DELETED));

    // find articles using the given text
    let articles, userArticles;
    let foundArticles = filterArticles(text, allArticles);
    if (req.user) {
        let userId = req.user._id;
        userArticles = foundArticles.filter(article => article.owner._id === userId);
        articles = foundArticles.filter(article => article.owner._id !== userId);
    } else {
        articles = foundArticles;
        userArticles = [];
    }

    res.json({
        articles: articles,
        userArticles: userArticles
    });
}

async function addPhoto(req, res) {
    try {
        const { articleId } = req.params;

        // check article exists - we decided against allowing not-existing articles to be created this way
        let article = checkUserOwnsArticle(articleId, req.user._id, `Artikel [${articleId}] darf nicht verändert werden`);

        const { photo } = req.body;

        let newFileName = photosController.addPhotoForArticle(articleId, photo);
        const isNewMainPhoto = photo.isMain;
        let photos = article.photos.map(photo => {
            if (isNewMainPhoto) {
                photo.isMain = false;
            }
            return photo;
        });
        photos.push(new Photo(newFileName, isNewMainPhoto, articleId));
        let articleToSave = dataCache.prepareArticle(article, req.user);
        articleToSave.photos = photos;
        const savedArticle = await dataCache.saveArticle(articleToSave);
        if (savedArticle) {
            res.json({ article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
        }
        else {
            throw new Error('Unbekannter Server-Fehler');
        }
    } catch(e) {
        handleError(e, res);
    }
}

async function deletePhoto(req, res) {
    try {
        const { articleId, fileName } = req.params;

        // check article exists - we decided against allowing not-existing articles to be created this way
        let article = checkUserOwnsArticle(articleId, req.user._id, `Artikel [${articleId}] darf nicht verändert werden`);

        let photos = article.photos.filter(photo => photo.fileName !== fileName);
        let articleToSave = dataCache.prepareArticle(article, req.user);
        articleToSave.photos = photos;
        const savedArticle = await dataCache.saveArticle(articleToSave);
        if (savedArticle) {
            photosController.deletePhotoForArticle(articleId, fileName);
            res.json({ article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
        }
        else {
            throw new Error('Unbekannter Server-Fehler');
        }
    } catch(e) {
        handleError(e);
    }
}

async function createNewCategories(theArticle) {
    const existingCategories = theArticle.categories.filter(category => category.hasOwnProperty('_id'));
    const newCategories = theArticle.categories.filter(category => !category.hasOwnProperty('_id'));
    theArticle.categories = [...existingCategories, ...await createCategories(newCategories)];
}

async function createCategories(theCategories) {
    const allSaveRequests = theCategories.map(category => {
        const preparedCategory = dataCache.prepareCategory(category);
        return dataCache.saveCategory(preparedCategory);
    });
    return await Promise.all(allSaveRequests);
}

function getTradesIfAllowed(theRequestingUser, theArticleId) {
    const article = dataCache.getArticleById(theArticleId);
    if (article && theRequestingUser && theRequestingUser._id === article.owner._id) {
        let trades = dataCache.getTradesByArticle(theArticleId);
        return trades.filter(trade => ((trade.state === TradeState.TRADE_STATE_INIT) && (trade.user1._id === theRequestingUser._id)) || (trade.state !== TradeState.TRADE_STATE_INIT));
    }
    return null;
}

function checkUserOwnsArticle(articleId, userId, errorText) {
    const article = dataCache.getArticleById(articleId);
    if (!article) {
        throw new ParameterValidationError(404, `Artikel [${articleId}] nicht gefunden`);
    }

    // check user owns this article
    if (article.owner._id !== userId) {
        throw new ParameterValidationError(403, errorText);
    }

    return article;
}

function handleError(e, res) {
    if (e instanceof ParameterValidationError) {
        res.status(e.statusCode).json({ errors: e.errors, globalError: e.message});
    } else {
        res.status(500).json({ globalError: e.message});
    }
}

module.exports = {
    getArticlesByOwner,
    getArticleById,
    deleteArticleById,
    createArticle,
    updateArticle,
    findArticles,
    addPhoto,
    deletePhoto
};
