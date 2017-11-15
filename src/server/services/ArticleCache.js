'use strict';

const Article = require('../../shared/businessobjects/Article');

class ArticleCache {
    constructor(db, users, categories) {
        this.db = db;
        this.users = users;
        this.categories = categories;
        this.articles = [];
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading articles...');
            this.db.find({}, (function(err, recs) {
                this.articles = recs.map(rec => this.toLogicalRecord(rec));
                console.log('articles loaded');
                resolve(this);
            }).bind(this));
        }).bind(this);

        return new Promise(load);
    }

    clear() {
        let clearOp = (function(resolve, reject) {
            console.log('Clearing articles...');
            this.db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing articles: ' + err);
                    reject(err);
                } else {
                    console.log('Articles have been cleared');
                    this.articles = [];
                    resolve(this);
                }
            }).bind(this));
        }).bind(this);

        let compactOp = (function(resolve, reject) {
            console.log('Compacting articles datafile...');
            this.db.on('compaction.done', () => {
                console.log('Articles datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        }).bind(this);

        return new Promise(clearOp).then(() => new Promise(compactOp));
    }

    save(theArticle) {
        let foundLogicalArticle;
        let saveOp;

        // retrieve article from cache if possible
        if (theArticle.hasOwnProperty('_id')) {
            foundLogicalArticle = this.findById(theArticle._id);
        }

        if (!foundLogicalArticle) {
            // if article wasn't found insert it
            saveOp = (function(resolve, reject) {
                this.db.insert(ArticleCache.toPhysicalRecord(theArticle), (function(err, newRec){
                    if (err) {
                        reject(err);
                    } else {
                        let newArticle = this.toLogicalRecord(newRec);
                        this.articles.push(newArticle);
                        theArticle._id = newArticle._id;
                        resolve(newArticle);
                    }
                }).bind(this))
            }).bind(this);
        } else {
            // article was found - update it
            saveOp = (function(resolve, reject) {
                if (foundLogicalArticle.update(theArticle)) {
                    this.db.update({ _id: foundLogicalArticle._id }, ArticleCache.toPhysicalRecord(foundLogicalArticle), {}, function(err, numAffected) {
                        err ? reject(err) : resolve(foundLogicalArticle);
                    });
                } else {
                    resolve(foundLogicalArticle);
                }
            }).bind(this);
        }

        return new Promise(saveOp);
    }

    findAll() {
        return this.articles.slice();
    }

    findById(theArticleId) {
        return this.articles.find(article => article._id === theArticleId);
    }

    findByOwner(theOwnerId) {
        return this.articles.filter(article => article.owner._id === theOwnerId);
    }

    prepare(obj, theOwner) {
        let article = new Article(obj);

        // each article must have an owner
        if (!article.owner) {
            article.owner = theOwner;
        }

        // normalize category array
        if (article.categories.length > 0) {
            article.categories = article.categories.map(category => this.categories.findById(category._id));
            article.sortCategories();
        }

        return article;
    }

    static toPhysicalRecord(article) {
        let physicalRecord = {};

        if (article.hasOwnProperty('_id')) {
            physicalRecord._id = article._id;
        }

        physicalRecord.ownerId = article.owner._id;
        physicalRecord.title = article.title;
        physicalRecord.description = article.description;
        physicalRecord.created = new Date(article.created);
        physicalRecord.status = article.status;
        physicalRecord.photos = article.photos.slice();
        physicalRecord.categoryIds = article.categories.map(category => category._id);

        return physicalRecord;
    }

    toLogicalRecord(thePhysicalRecord) {
        let article = new Article(null);

        article._id = thePhysicalRecord._id;
        article.owner = this.users.findById(thePhysicalRecord.ownerId);
        article.title = thePhysicalRecord.title;
        article.description = thePhysicalRecord.description;
        article.created = thePhysicalRecord.created;
        article.status = thePhysicalRecord.status;
        article.photos = thePhysicalRecord.photos ? thePhysicalRecord.photos.slice() : [];
        article.categories = thePhysicalRecord.categoryIds ? thePhysicalRecord.categoryIds.map(id => this.categories.findById(id)) : [];
        article.sortCategories();

        return article;
    }
}

module.exports = {
    ArticleCache
};
