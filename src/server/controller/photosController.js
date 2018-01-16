'use strict';

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const dataCache = require('../services/DataCache').dataCache;

function addPhotoForArticle(theArticleId, thePhoto) {
    const directory = getOrCreateArticleImagesDirectory(theArticleId);
    let imageBuffer = new Buffer(thePhoto.fileContent.substr(thePhoto.fileContent.indexOf(',') + 1), 'base64');
    const newUniqueFileName = createUniqueFileName(directory, thePhoto.fileName);
    fs.writeFileSync(path.join(directory, newUniqueFileName), imageBuffer);
    return newUniqueFileName;
}

function deletePhotoForArticle(theArticleId, theFileName) {
    const directory = getOrCreateArticleImagesDirectory(theArticleId);
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        const fileToDelete = files.find(file => file === theFileName);
        if (fileToDelete) {
            fs.unlinkSync(path.join(directory, fileToDelete));
        }
    }
}

function deleteAllPhotosForArticle(theArticleId) {
    const directory = path.join(getOrCreateArticleImagesRootDirectory(), theArticleId);
    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);
        files.forEach(file => {
            fs.unlinkSync(path.join(directory, file));
        });
        fs.rmdirSync(directory);
    }
}

function getOrCreateArticleImagesDirectory(theArticleId) {
    const directory = path.join(getOrCreateArticleImagesRootDirectory(), theArticleId);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    return directory;
}

function getOrCreateArticleImagesRootDirectory() {
    const imagesDirectory = path.join(dataCache.webrootDir, 'images');
    if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory);
    }
    const articleImagesDirectory = path.join(imagesDirectory, 'article');
    if (!fs.existsSync(articleImagesDirectory)) {
        fs.mkdirSync(articleImagesDirectory);
    }
    return articleImagesDirectory;
}

function createUniqueFileName(theArticleDirectory, theFileName) {
    let newFileName;
    let foundFile;
    const files = fs.readdirSync(theArticleDirectory);
    do {
        newFileName = uuid.v1() + theFileName.substr(theFileName.lastIndexOf('.'));
        foundFile = files.find(file => file === newFileName);
    } while (foundFile);
    return newFileName;
}

module.exports = {
    addPhotoForArticle,
    deletePhotoForArticle,
    deleteAllPhotosForArticle
};
