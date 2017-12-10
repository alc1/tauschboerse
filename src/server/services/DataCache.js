'use strict';

const ArticleCache = require('./ArticleCache');
const CategoryCache = require('./CategoryCache');
//const OfferCache = require('./OfferCache');
const TradeCache = require('./TradeCache');
const UserCache = require('./UserCache');

const db = require('./dataFiles');
const resetData = require('./resetData');

class DataCache {

    constructor() {
        this.users = new UserCache(db.dbUsers);
        this.categories = new CategoryCache(db.dbCategories);
        this.articles = new ArticleCache(db.dbArticles, this.users, this.categories);
        this.trades = new TradeCache(db.dbTrades, this.users);
//        this.offers = new OfferCache(db.dbOffers, this.trades, this.articles, this.users);
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

        // return this.offers.clear()
        //     .then(() => this.trades.clear())
        //     .then(() => this.articles.clear())
        //     .then(() => this.categories.clear())
        //     .then(() => this.users.clear());
    }

    /*
     * Article
     */

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
        return this.categories.delete(categoryId);
    }
    
    //--------------------
    // offer methods
    //--------------------
    // prepareOffer(obj) {
    //     return this.offers.prepare(obj);
    // }

    // saveOffer(offer) {
    //     return this.offers.save(offer);
    // }

    // deleteOffer(offerId) {
    //     return this.offers.delete(offerId);
    // }

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

    getTrade(id) {
        return this.trades.find(id);
    }

    saveTrade(trade) {
        return this.trades.save(trade);
    }

    deleteTrade(tradeId) {
        return this.trades.delete(tradeId);
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
