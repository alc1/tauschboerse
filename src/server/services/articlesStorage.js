'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename : './data/articles.db', autoload : true });

function insertTestData(doAfterInsert) {
    const articles = [
        {userId: '1', title: 'Tisch', description: 'Antiker Tisch aus dem Jahr 1900'},
        {userId: '1', title: 'PC', description: 'Computer mit super Grafikkarte'},
        {userId: '1', title: 'Fussballschuhe', description: 'Fussballschuhe, fast neu...'},
        {userId: '2', title: 'Kinderwagen', description: 'Kind ist schon zu gross dafür'},
    ];
    db.insert(articles, (err, newDocs) => {
        if (doAfterInsert) {
            doAfterInsert(err, newDocs);
        }
    });
}

function getArticlesByUser(theUserId, doAfterFind) {
    db.find({ $where : function() { return this.userId === theUserId } }, (err, articles) => {
        if (doAfterFind) {
            doAfterFind(err, articles);
        }
    });
}

function getArticle(theArticleId, doAfterFind) {
    db.findOne({ _id : theArticleId }, (err, article) => {
        if (doAfterFind) {
            doAfterFind(err, article);
        }
    });
}

module.exports = {
    getArticlesByUser,
    getArticle,
    insertTestData
};
