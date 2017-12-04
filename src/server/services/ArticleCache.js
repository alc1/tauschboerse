'use strict';

const uuid = require('uuid');

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
                this.db.insert(ArticleCache.toPhysicalRecord(theArticle), (function(err, newRec) {
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

    deleteById(theArticleId) {
        let deleteOp = (function(resolve, reject) {
            let foundArticle = this.findById(theArticleId);
            if (foundArticle) {
                this.articles = this.articles.filter(article => article._id !== theArticleId);
                this.db.remove({ _id: theArticleId }, {}, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }).bind(this);

        return new Promise(deleteOp);
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

        if (article.photos.length > 0) {
            article.photos.forEach(photo => {
                delete photo.isNew;
                delete photo.fileContent;
                photo.url = `/images/article/${article._id}/${photo.fileName}`;
            });
        }

        return article;
    }

    static toPhysicalRecord(theArticle) {
        let physicalRecord = {};

        if (theArticle.hasOwnProperty('_id')) {
            physicalRecord._id = theArticle._id;
        }

        physicalRecord.ownerId = theArticle.owner._id;
        physicalRecord.title = theArticle.title;
        physicalRecord.description = theArticle.description;
        physicalRecord.created = new Date(theArticle.created);
        physicalRecord.status = theArticle.status;
        physicalRecord.photos = theArticle.photos.map(photo => photo.fileName);
        physicalRecord.categoryIds = theArticle.categories.map(category => category._id);

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
        article.photos = thePhysicalRecord.photos ? thePhysicalRecord.photos.map(photoFileName => {
            return {
                fileName: photoFileName,
                url: `/images/article/${article._id}/${photoFileName}`
            };
        }) : [];
        article.categories = thePhysicalRecord.categoryIds ? thePhysicalRecord.categoryIds.map(id => this.categories.findById(id)) : [];
        article.sortCategories();

        return article;
    }
}

module.exports = ArticleCache;
