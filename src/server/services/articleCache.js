'use strict'

const Datastore = require('nedb');
const dbArticles = new Datastore({ filename : './data/articles.db', autoload : true });
const dbArticleCategories = new Datastore({ filename : './data/articleCategories.db', autoload : true });

export class ArticleCache {
    constructor(users, categories) {
        this.users = users;
        this.categores = categories;

        this.articles = [];
    }

    init() {
        function initArticles() {
            return new Promise((resolve, reject) => {
                dbArticles.find({}, (err, recs) => {
                    this.articles = recs;
                    recs.forEach(rec => {
                        rec.owner = this.users.find(rec.ownerId);
                    });
                    resolve(this);
                });
            });
        }

        function initArticleCategories() {
            return new Promise((resolve, reject) => {
                dbArticleCategories.find({}, (err, recs) => {
                    recs.forEach(rec => {
                        let article = this.find(rec.articleId);
                        let category = this.categories.find(rec.categoryId);
        
                        if (!article.categories) {
                            article.categories = [];
                        }
                        article.categories.push(category);
                    });
                    resolve(this);
                });
            });
        }

        return initArticles().then(() => this.initArticleCategories());
    }

    findAll() {
        return this.articles.slice();
    }

    find(id) {
        return this.articles.find(article => article._id === id);
    }
}