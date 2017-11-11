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

    /*
     * Article
     */

    prepareArticle(obj, user) {
        return this.articles.prepare(obj, user);
    }

    getAllArticles() {
        return this.articles.findAll();
    }

    getArticleById(theArticleId) {
        return this.articles.findById(theArticleId);
    }

    getArticlesByOwner(theOwnerId) {
        return this.articles.findByOwner(theOwnerId);
    }

    saveArticle(theArticle) {
        return this.articles.save(theArticle);
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

    /*
     * User
     */
    prepareUser(obj) {
        return this.users.prepare(obj);
    }

    getAllUsers() {
        return this.users.findAll();
    }

    getUserById(theUserId) {
        return this.users.findById(theUserId);
    }

    getUserByEmail(theEmail) {
        return this.users.findByEmail(theEmail);
    }

    saveUser(user) {
        return this.users.save(user);
    }

    authenticateUser(theEmail, thePassword) {
        return this.users.authenticate(theEmail, thePassword);
    }

    getPasswordByUserId(theUserId) {
        return this.users.getPasswordByUserId(theUserId);
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
