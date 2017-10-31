'use strict'

const bcrypt = require('bcrypt');
const Datastore = require('nedb');

const ArticleCache = require('./articleCache').ArticleCache;
const CategoryCache = require('./categoryCache').CategoryCache;
const OfferCache = require('./offerCache').OfferCache;
const TransactionCache = require('./transactionCache').TransactionCache;
const UserCache = require('./userCache').UserCache;

class DataCache {

    constructor() {
        this.users = new UserCache();
        this.categories = new CategoryCache();
        this.articles = new ArticleCache(this.users, this.categories);
        this.transactions = new TransactionCache(this.users);
        this.offers = new OfferCache(this.transactions, this.articles, this.users);
    }

    init() {
        return Promise.all([
                this.users.init(),
                this.categories.init()
            ])
            .then(
                () => this.articles.init()
            )
            .then (
                () => this.transactions.init()
            )
            .then(
                () => this.offers.init()
            );
    }

    clear() {
        return this.offers.clear()
            .then(() => this.transactions.clear())
            .then(() => this.articles.clear())
            .then(() => this.categories.clear())
            .then(() => this.users.clear());
    }

    getArticles() {
        return this.articles.findAll();
    }

    saveArticle(article) {
        return this.articles.save(article);
    }

    getCategories() {
        return this.categories.findAll();
    }

    saveCategory(category) {
        return this.categories.save(category);
    }

    getTransaction(id) {
        return this.transactions.find(id);
    }

    getUserTransactions(userId) {
        return this.transactions.findByUser(userId);
    }

    getUser(id) {
        return this.users.find(id);
    }

    saveUser(user) {
        return this.users.save(user);
    }

    authenticateUser(id, pwd) {
        return this.users.authenticate(id, pwd);
    }
}

var  dataCache;

function initDataCache(reset) {
    console.log('Initialising data cache...');

    dataCache = new DataCache();
    let promise = dataCache.init();

    if (reset) {
        promise = promise.then(() => resetData(dataCache));
    }

    return promise;
}

module.exports = {
    dataCache,
    initDataCache
};
