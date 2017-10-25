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

    getTransactions() {
        return this.transactions.findAll();
    }
}

var  dataCache;

function initDataCache() {
    dataCache = new DataCache();
    return dataCache.init();
}

module.exports = {
    dataCache,
    initDataCache
};
