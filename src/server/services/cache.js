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
        this.offers = new OfferCache(this.articles);
        this.transactions = new TransactionCache(this.users, this.offers);
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
                () => this.offers.init()
            )
            .then(
                () => this.transactions.init()
            );
    }

    getArticles() {
        return this.articles.findAll();
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

    authenticateUser(id, pwd) {
        return this.users.authenticate(id, pwd);
    }
}

var  dataCache;

function initDataCache() {
    dataCache = new DataCache();
    console.log('Initialising data cache...');
    return dataCache.init();
}

module.exports = {
    dataCache,
    initDataCache
};
