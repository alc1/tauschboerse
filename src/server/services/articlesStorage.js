'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename : './data/articles.db', autoload : true });

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

module.exports = {
    getArticlesByUser,
    getArticle,
    insertTestData
};
