'use strict';

const db = require('./dataFiles').dbArticles;
const Article = require('../../shared/businessobjects/Article');

class ArticleCache {
    constructor(users, categories) {
        this.users = users;
        this.categories = categories;

        this.articles = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading articles...');
            db.find({}, (function(err, recs) {
                this.articles = recs.map(rec => this.toLogicalRecord(rec));
                console.log('articles loaded');
                resolve(this);
            }).bind(this));
        };

        return new Promise(load.bind(this));
    }

    clear() {
        let deleteAll = function(resolve, reject) {
            db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    this.articles = [];
                    resolve(this);
                }
            }).bind(this));
        };

        return new Promise(deleteAll.bind(this));
    }

    save(article) {
        let rec;
        let saveOp;

        // retrieve article from cache if possible
        if (article.hasOwnProperty('_id')) {
            let rec = this.findById(article._id);
        }

        if (!rec) {
            // if article wasn't found insert it
            saveOp = function(resolve, reject) {
                db.insert(ArticleCache.toPhysicalRecord(article), (function(err, savedArticle) {
                    const newArticle = this.toLogicalRecord(savedArticle);
                    this.articles.push(newArticle);
                    resolve(newArticle);
                }).bind(this))
            };
        } else {
            // article was found - update it
            saveOp = function(resolve, reject) {
                if (rec.update(article)) {
                    db.update({}, ArticleCache.toPhysicalRecord(rec), function(err, numAffected) {
                        err ? reject(err) : resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            };
        }

        return new Promise(saveOp.bind(this));
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

    prepare(obj, user) {
        let article = new Article(obj);

        // each article must have an owner
        if (!article.owner) {
            article.owner = user;
        }

        // normalize category array
        if (article.categories.length > 0) {
            article.categories = article.categories.map(category => this.categories.find(category._id));
            article.sortCategories();
        }

        return article;
    }

    static toPhysicalRecord(article) {
        let rec = {};

        if (article.hasOwnProperty('_id')) {
            rec._id = article._id;
        }

        rec.ownerId = article.owner._id;
        rec.title = article.title;
        rec.description = article.description;
        rec.created = article.created;
        rec.status = article.status;
        rec.photos = article.photos.slice();
        rec.categoryIds = article.categories.map(category => category._id);

        return rec;
    }

    toLogicalRecord(rec) {
        let article = new Article(null);
        article._id = rec._id;
        article.owner = this.users.find(rec.ownerId);
        article.title = rec.title;
        article.description = rec.description;
        article.created = rec.created;
        article.status = rec.status;
        article.photos = rec.photos ? rec.photos.slice() : [];
        article.categories = rec.categoryIds ? rec.categoryIds.map(id => this.categories.find(id)) : [];
        article.sortCategories();

        return article;
    }
}

module.exports = {
    ArticleCache
};
