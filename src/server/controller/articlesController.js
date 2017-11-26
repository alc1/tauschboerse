'use strict';

const fs = require('fs');
const path = require('path');

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

async function deleteArticleById(req, res) {
    if (useDataCache) {
        const { articleId } = req.params;
        dataCache.deleteArticleById(articleId)
            .then(() => {
                deletePhotos(articleId);
                res.json({ articleId });
            })
            .catch(err => {
                res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
            });
    }
}

async function createArticle(req, res) {
    if (useDataCache) {
        const { article } = req.body;
        const photos = article.photos.map(photo => {
            return Object.assign({}, photo);
        });
        const validation = await articleCreatorValidator.validate(article);
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
        const photos = article.photos.map(photo => {
            return Object.assign({}, photo);
        });
        const validation = await articleUpdaterValidator.validate(articleId, article);
        if (validation.success) {
            await createNewCategories(article);
            const preparedArticle = dataCache.prepareArticle(article, req.user);
            const savedArticle = await dataCache.saveArticle(preparedArticle);
            if (savedArticle) {
                savePhotos(savedArticle._id, photos);
                res.json({ article: article });
            }
            else {
                res.status(500).json({ globalError: 'Unbekannter Server-Fehler' });
            }
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
    const imagesDirectory = './../../public/images';
    if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory);
    }
    const articleImagesDirectory = path.join(imagesDirectory, 'article');
    if (!fs.existsSync(articleImagesDirectory)) {
        fs.mkdirSync(articleImagesDirectory);
    }
    return articleImagesDirectory;
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
    deleteArticleById,
    createArticle,
    updateArticle
};
