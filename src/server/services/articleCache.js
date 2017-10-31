'use strict'

const Datastore = require('nedb');
const dataFiles = require('./dataFiles');

const dbArticles = dataFiles.dbArticles;
const dbArticleCategories = dataFiles.dbArticleCategories;

class ArticleCache {
    constructor(users, categories) {
        this.users = users;
        this.categories = categories;

        this.articles = [];
    }

    init() {
        let initArticles = (function() {
            let load = (function(resolve, reject) {
                console.log('Loading articles...');
                dbArticles.find({}, (function(err, recs) {
                    this.articles = recs;
                    recs.forEach(rec => {
                        rec.owner = this.users.find(rec.ownerId);
                    });
                    console.log('articles loaded');
                    resolve(this);
                }).bind(this));
            }).bind(this);

            return new Promise(load);
        }).bind(this);

        let initArticleCategories = (function() {
            let load = (function(resolve, reject) {
                console.log('Loading article categories...');
                dbArticleCategories.find({}, (function(err, recs) {
                    recs.forEach(rec => {
                        let article = this.find(rec.articleId);
                        let category = this.categories.find(rec.categoryId);
        
                        if (!article.categories) {
                            article.categories = [];
                        }
                        article.categories.push(category);
                    });
                    console.log('article categories loaded');
                    resolve(this);
                }).bind(this));
            }).bind(this);

            return new Promise(load);
        }).bind(this);

        return initArticles().then(() => initArticleCategories());
    }

    clear() {
        let removeArticleCategories = (function() {
            return new Promise((function(resolve, reject) {
                this.dbArticleCategories.remove({}, { multi: true }, (err, numRemoved) => {
                    resolve(numRemoved);
                });
            }).bind(this));
        }).bind(this);

        let removeArticles = (function() {
            return new Promise((function(resolve, reject) {
                this.dbArticles.remove({}, { multi: true }, (function(err, numRemoved) {
                    this.articles = [];
                    resolve(this);
                }).bind(this));
            }).bind(this));
        }).bind(this);

        return removeArticleCategories().then(() => removeArticles());
    }

    save(article) {
        let rec;
        let saveOp;

        // retrieve article from cache if possible
        if (article.hasOwnProperty('_id')) {
            let rec = this.find(article._id);
        }

        if (rec == null) {
            // if article wasn't found insert it
            saveOp = (function(resolve, reject) {

            })
        } else {
            // article was found - update it
            saveOp = (function(resolve, reject) {
                if (rec.update(article)) {
                    dbArticles.update({}, rec, function(err, newArticle) {
                        resolve(newArticle);
                    });
                } else {
                    resolve(0);
                }
            });
        }
    }

    findAll() {
        return this.articles.slice();
    }

    find(id) {
        return this.articles.find(article => article._id === id);
    }
}

module.exports = {
    ArticleCache
};
