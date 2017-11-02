'use strict';

const dataFiles = require('./dataFiles');

const dbOffers = dataFiles.dbOffers;
const dbOfferArticles = dataFiles.dbOfferArticles;

class OfferCache {
    constructor(transactions, articles, users) {
        this.transactions = transactions;
        this.articles = articles;
        this.users = users;

        this.offers = [];
    }

    init() {
        let initOffers = (function() {
            let load = (function(resolve, reject) {
                console.log('Loading offers...');
                dbOffers.find({}, (function(err, recs) {
                    this.offers = recs;
                    this.offers.forEach(offer => {
                        offer.transaction = this.transactions.find(offer.transactionId);
                        offer.sender = this.users.find(offer.senderId);
                        offer.receiver = this.users.find(offer.receiverId);
                    });
                    console.log('offers loaded');
                    resolve(this);
                }).bind(this));
            }).bind(this);
                        
            return new Promise((load).bind(this));
        }).bind(this);

        let initOfferArticles = (function() {
            let load = (function(resolve, reject) {
                console.log('Loading offer articles...');
                dbOfferArticles.find({}, (function(err, recs) {
                    recs.forEach(rec => {
                        let offer = this.find(rec.offerId);
                        let article = this.articles.find(rec.articleId);
        
                        if (!offer.articles) {
                            offer.articles = [];
                        }
                        offer.articles.push(article);
                    });
                    console.log('offer articles loaded');
                    resolve(this);
                }).bind(this));
            }).bind(this);
            
            return new Promise(load);
        }).bind(this);

        return initOffers().then(() => initOfferArticles());
    }

    clear() {
        let removeOfferArticles = (function() {
            return new Promise((function(resolve, reject) {
                dbOfferArticles.remove({}, { multi: true }, (err, numRemoved) => {
                    resolve(numRemoved);
                });
            }).bind(this));
        }).bind(this);

        let removeOffers = (function() {
            return new Promise((function(resolve, reject) {
                dbOffers.remove({}, { multi: true }, (function(err, numRemoved) {
                    this.offers = [];
                    resolve(numRemoved);
                }).bind(this));
            }).bind(this));
        }).bind(this);

        return removeOfferArticles().then(() => removeOffers());
    }

    save(offer) {
        
    }

    find(id) {
        return this.offers.find(offer => offer._id === id);
    }
}

module.exports = {
    OfferCache
};
