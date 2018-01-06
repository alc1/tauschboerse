'use strict';

const fs = require('fs');
const path = require('path');

const articleCreatorValidator = require('./articleCreatorValidator');
const articleUpdaterValidator = require('./articleUpdaterValidator');

const ArticleStatus = require('../../shared/constants/ArticleStatus');

const dataCache = require('../services/DataCache').dataCache;

function getArticlesByOwner(req, res) {
    const { userId } = req.params;
    res.json({ articles: dataCache.getArticlesByOwner(userId) || [] });
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

function getTradesIfAllowed(theRequestingUser, theArticleId) {
    const article = dataCache.getArticleById(theArticleId);
    if (article && theRequestingUser && theRequestingUser._id === article.owner._id) {
        return dataCache.getTradesByArticle(theArticleId);
    }
    return null;
}

async function deleteArticleById(req, res) {
    const { articleId } = req.params;
    const article = dataCache.getArticleById(articleId);
    if (article) {
        if (isArticleUsed(article) && article.status !== ArticleStatus.STATUS_DEALED && article.status !== ArticleStatus.STATUS_DELETED) {
            let articleToSave = dataCache.prepareArticle(article, req.user);
            articleToSave.status = ArticleStatus.STATUS_DELETED;
            const savedArticle = await dataCache.saveArticle(articleToSave);
            if (savedArticle) {
                // TODO Trades invalidieren
                res.json({ isDeleted: true, article: savedArticle, trades: getTradesIfAllowed(req.user, articleId) });
            }
            else {
                res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
            }
        }
        else if (article.status === ArticleStatus.STATUS_FREE) {
            dataCache.deleteArticleById(articleId)
                .then(() => {
                    deletePhotos(articleId);
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

function isArticleUsed(theArticle) {
    const trades = dataCache.getTradesByArticle(theArticle._id);
    return trades && trades.length > 0;
}

async function createArticle(req, res) {
    const { article } = req.body;
    const photos = article.photos.map(photo => {
        return Object.assign({}, photo);
    });
    const validation = articleCreatorValidator.validate(article);
    if (validation.success) {
        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        const savedArticle = await dataCache.saveArticle(preparedArticle);
        if (savedArticle) {
            savePhotos(savedArticle._id, photos);
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
    const photos = article.photos.map(photo => {
        return Object.assign({}, photo);
    });
    const validation = articleUpdaterValidator.validate(articleId, article);
    if (validation.success) {
        await createNewCategories(article);
        const preparedArticle = dataCache.prepareArticle(article, req.user);
        const savedArticle = await dataCache.saveArticle(preparedArticle);
        if (savedArticle) {
            savePhotos(savedArticle._id, photos);
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
    res.json({
        articles: dataCache.getAllArticles(),
        version: 0
    });
}

async function createNewCategories(theArticle) {
    const existingCategories = theArticle.categories.filter(category => category.hasOwnProperty('_id'));
    const newCategories = theArticle.categories.filter(category => !category.hasOwnProperty('_id'));
    const allSaveRequests = newCategories.map(category => {
        const preparedCategory = dataCache.prepareCategory(category);
        return dataCache.saveCategory(preparedCategory);
    });
    const createdCategories = await Promise.all(allSaveRequests);
    theArticle.categories = [...existingCategories, ...createdCategories];
}

function isInPhotos(thePhotos, theFileName) {
    return !!thePhotos.find(photo => photo.fileName === theFileName);
}

function savePhotos(theArticleId, thePhotos) {
    const directory = path.join(getOrCreateArticleImagesRootDirectory(), theArticleId);
    // Directory already exists, check if there are photos to delete
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        const filesToDelete = files.filter(file => !isInPhotos(thePhotos, file));
        filesToDelete.forEach(fileToDelete => {
            fs.unlinkSync(path.join(directory, fileToDelete));
        });
    }
    // Directory doesn't exist yet, just create it
    else {
        fs.mkdirSync(directory);
    }
    const newPhotos = thePhotos.filter(photo => photo.isNew && photo.fileContent);
    newPhotos.forEach(photo => {
        let imageBuffer = new Buffer(photo.fileContent.substr(photo.fileContent.indexOf(',') + 1), 'base64');
        fs.writeFileSync(path.join(directory, photo.fileName), imageBuffer);
    });
}

function deletePhotos(theArticleId) {
    const directory = path.join(getOrCreateArticleImagesRootDirectory(), theArticleId);
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        files.forEach(file => {
            fs.unlinkSync(path.join(directory, file));
        });
        fs.rmdirSync(directory);
    }
}

function getOrCreateArticleImagesRootDirectory() {
    const imagesDirectory = path.join(__dirname, './../../../public/images');
    if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory);
    }
    const articleImagesDirectory = path.join(imagesDirectory, 'article');
    if (!fs.existsSync(articleImagesDirectory)) {
        fs.mkdirSync(articleImagesDirectory);
    }
    return articleImagesDirectory;
}

module.exports = {
    getArticlesByOwner,
    getArticleById,
    deleteArticleById,
    createArticle,
    updateArticle,
    findArticles,
};
