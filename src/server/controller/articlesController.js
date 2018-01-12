'use strict';

const articleCreatorValidator = require('./articleCreatorValidator');
const articleUpdaterValidator = require('./articleUpdaterValidator');

const photosController = require('./photosController');
const commonController = require('./commonController');

const ArticleStatus = require('../../shared/constants/ArticleStatus');
const Photo = require('../model/Photo');

const filterArticles = require('../../shared/filterArticles');

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
    const { articleId } = req.params;
    const article = dataCache.getArticleById(articleId);
    if (article) {
        if (dataCache.isArticleUsed(article._id) && article.status !== ArticleStatus.STATUS_DEALED && article.status !== ArticleStatus.STATUS_DELETED) {
            let articleToSave = dataCache.prepareArticle(article, req.user);
            articleToSave.status = ArticleStatus.STATUS_DELETED;
            const savedArticle = await dataCache.saveArticle(articleToSave);
            if (savedArticle) {
                commonController.findAndFlagInvalidTrades([savedArticle]);
                res.json({ isDeleted: true, article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
            }
            else {
                res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
            }
        }
        else if (article.status === ArticleStatus.STATUS_FREE) {
            dataCache.deleteArticleById(articleId)
                .then(() => {
                    photosController.deleteAllPhotosForArticle(articleId);
                    res.json({ isDeleted: true, articleId });
                })
                .catch(() => {
                    res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
                });
        }
        else {
            res.json({ isDeleted: false, articleId });
        }
    }
    else {
        res.status(404).json({ globalError: 'Der zu löschende Artikel wurde nicht gefunden.' });
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
    const { articleId } = req.params;
    const { article } = req.body;
    const validation = articleUpdaterValidator.validate(articleId, article);
    if (validation.success) {
        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        const savedArticle = await dataCache.saveArticle(preparedArticle);
        if (savedArticle) {
            res.json({ article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
        }
        else {
            res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
        }
    }
    else {
        res.status(validation.status).json({ errors: validation.errors, globalError: validation.globalError });
    }
}

function findArticles(req, res) {
    const { text } = req.query;

    // only available articles should be considered
    let articles = dataCache.getAllArticles().filter(a => (a.status !== ArticleStatus.STATUS_DEALED) && (a.status !== ArticleStatus.STATUS_DELETED));

    res.json({
        articles: filterArticles(text, articles),
        version: 0
    });
}

async function addPhoto(req, res) {
    const { articleId } = req.params;
    const { photo } = req.body;
    let article = dataCache.getArticleById(articleId);
    if (article) {
        let newFileName;
        try {
            newFileName = photosController.addPhotoForArticle(articleId, photo);
        } catch (error) {
            res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
            return;
        }
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
            res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
        }
    }
    else {
        res.status(404).json({ globalError: 'Der Artikel wurde nicht gefunden.' });
    }
}

async function deletePhoto(req, res) {
    const { articleId, fileName } = req.params;
    let article = dataCache.getArticleById(articleId);
    if (article) {
        let photos = article.photos.filter(photo => photo.fileName !== fileName);
        let articleToSave = dataCache.prepareArticle(article, req.user);
        articleToSave.photos = photos;
        const savedArticle = await dataCache.saveArticle(articleToSave);
        if (savedArticle) {
            photosController.deletePhotoForArticle(articleId, fileName);
            res.json({ article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
        }
        else {
            res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
        }
    }
    else {
        res.status(404).json({ globalError: 'Der Artikel wurde nicht gefunden.' });
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
        return dataCache.getTradesByArticle(theArticleId);
    }
    return null;
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
