'use strict';

const Datastore = require('nedb');
const dataFiles = require('./dataFiles');

const db = dataFiles.dbArticles;

const storageUtils = require('../utils/storageUtils');

function insertTestData() {
    const articles = [
        {userId: '1', title: 'Tisch', description: 'Antiker Tisch aus dem Jahr 1900'},
        {userId: '1', title: 'PC', description: 'Computer mit super Grafikkarte'},
        {userId: '1', title: 'Fussballschuhe', description: 'Fussballschuhe, fast neu...'},
        {userId: '2', title: 'Kinderwagen', description: 'Kind ist schon zu gross dafür'},
    ];
    return new Promise((resolve, reject) => {
        db.insert(articles, (err, newDocs) => {
            storageUtils.handlePromiseResult(resolve, newDocs, reject, err);
        });
    });
}

function getArticlesByUser(theUserId) {
    return new Promise((resolve, reject) => {
        db.find({ $where : function() { return this.userId === theUserId } }, (err, articles) => {
            storageUtils.handlePromiseResult(resolve, articles, reject, err);
        });
    });
}

function getArticle(theArticleId) {
    return new Promise((resolve, reject) => {
        db.findOne({ _id : theArticleId }, (err, article) => {
            storageUtils.handlePromiseResult(resolve, article, reject, err);
        });
    });
}

function createArticle(theArticle) {
    return new Promise((resolve, reject) => {
        db.insert(theArticle, (err, newDoc) => {
            storageUtils.handlePromiseResult(resolve, newDoc, reject, err);
        });
    });
}

function updateArticle(theArticleId, theArticleDetails) {
    return new Promise((resolve, reject) => {
        db.update({ _id: theArticleId }, { $set: theArticleDetails }, {}, (err, numAffected) => {
            storageUtils.handlePromiseResult(resolve, numAffected, reject, err);
        });
    });
}

module.exports = {
    getArticlesByUser,
    getArticle,
    createArticle,
    updateArticle,
    insertTestData
};
