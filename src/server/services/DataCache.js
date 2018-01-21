'use strict';

const ArticleCache = require('./ArticleCache');
const CategoryCache = require('./CategoryCache');
const TradeCache = require('./TradeCache');
const UserCache = require('./UserCache');

const db = require('./dataFiles');
const resetData = require('./resetData');

class DataCache {

    constructor() {
        this.users = new UserCache(db.dbUsers);
        this.categories = new CategoryCache(db.dbCategories);
        this.articles = new ArticleCache(db.dbArticles, this.users, this.categories);
        this.trades = new TradeCache(db.dbTrades, this.users, this.articles);
    }

    init(webroot) {
        this.__webrootDir = webroot;

        return Promise.all([
                this.users.init(),
                this.categories.init()
            ])
            .then(
                () => this.articles.init()
            )
            .then (
                () => this.trades.init()
            )
            // .then(
            //     () => this.offers.init()
            // )
            ;
    }

    clear() {
        return this.trades.clear()
            .then(() => this.articles.clear())
            .then(() => this.categories.clear())
            .then(() => this.users.clear());
    }

    dump() {
        this.users.dump();
        this.categories.dump();
        this.articles.dump();
        this.trades.dump();
    }

    get webrootDir() {
        return this.__webrootDir;
    }

    //--------------------
    // article methods
    //--------------------

    prepareArticle(obj, theOwner) {
        return this.articles.prepare(obj, theOwner);
    }

    getAllArticles() {
        return this.articles.findAll();
    }

    getArticleById(theArticleId) {
        return this.articles.findById(theArticleId);
    }

    getArticlesById(theArticleIds) {
        return theArticleIds.map(id => this.getArticleById(id));
    }

    getArticlesByOwner(theOwnerId) {
        return this.articles.findByOwner(theOwnerId);
    }

    saveArticle(theArticle) {
        return this.articles.save(theArticle);
    }

    deleteArticleById(theArticleId) {
        return this.articles.deleteById(theArticleId);
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
        return this.categories.deleteById(categoryId);
    }

    //--------------------
    // trade methods
    //--------------------

    prepareTrade(obj) {
        return this.trades.prepare(obj);
    }

    getAllTrades() {
        return this.trades.findAll();
    }

    getTradesByUser(theUserId) {
        return this.trades.findByUserId(theUserId);
    }

    getTradesByArticle(theArticleId, onlyInCurrentOffer = false) {
        return this.trades.findByArticleId(theArticleId, onlyInCurrentOffer);
    }

    getTrade(id) {
        return this.trades.find(id);
    }

    saveTrade(trade) {
        return this.trades.save(trade);
    }

    deleteTrade(tradeId) {
        return this.trades.delete(tradeId);
    }

    isArticleUsed(theArticleId) {
        return this.trades.isArticleUsed(theArticleId);
    }

    //--------------------
    // user methods
    //--------------------

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

function initDataCache(reset, webroot) {
    console.log('Initialising data cache...');

    let promise = dataCache.init(webroot);

    if (reset) {
        promise = promise.then(() => resetData(dataCache, webroot));
    }

    return promise;
}

module.exports = {
    dataCache,
    initDataCache
};
