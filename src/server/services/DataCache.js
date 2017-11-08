'use strict';

const ArticleCache = require('./ArticleCache').ArticleCache;
const CategoryCache = require('./CategoryCache').CategoryCache;
const OfferCache = require('./OfferCache').OfferCache;
const TransactionCache = require('./TransactionCache').TransactionCache;
const UserCache = require('./UserCache').UserCache;

const resetData = require('./initData').resetData;

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

    //--------------------
    // article methods
    //--------------------
    prepareArticle(obj, user) {
        return this.articles.prepare(obj, user);
    }

    getArticles() {
        return this.articles.findAll();
    }

    saveArticle(article) {
        return this.articles.save(article);
    }

    //--------------------
    // category methods
    //--------------------
    prepareCategory(obj) {
        return this.categories.prepare(obj);
    }

    getCategories() {
        return this.categories.findAll();
    }

    saveCategory(category) {
        return this.categories.save(category);
    }

    deleteCategory(categoryId) {
        return this.categories.delete(categoryId);
    }
    
    //--------------------
    // offer methods
    //--------------------
    prepareOffer(obj) {
        return this.offers.prepare(obj);
    }

    saveOffer(offer) {
        return this.offers.save(offer);
    }

    deleteOffer(offerId) {
        return this.offers.delete(offerId);
    }

    //--------------------
    // transaction methods
    //--------------------
    prepareTransaction(obj) {
        return this.transactions.prepare(obj);
    }

    getUserTransactions(userId) {
        return this.transactions.findByUserId(userId);
    }

    getTransaction(id) {
        return this.transactions.find(id);
    }

    saveTransaction(transaction) {
        // TODO
    }

    deleteTransaction(transactionId) {
        return this.transactions.delete(transactionId);
    }

    //--------------------
    // user methods
    //--------------------
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

const dataCache = new DataCache();

function initDataCache(reset) {
    console.log('Initialising data cache...');

    //dataCache = new DataCache();
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
