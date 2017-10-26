'use strict'

const Datastore = require('nedb');
const dataFiles = require('./dataFiles');

const dbOffers = dataFiles.dbOffers;
const dbOfferArticles = dataFiles.dbOfferArticles;

class OfferCache {
    constructor(articles) {
        this.articles = articles;

        this.offers = [];
    }

    init() {
        let initOffers = (function() {
            let load = (function(resolve, reject) {
                console.log('Loading offers...');
                dbOffers.find({}, (function(err, recs) {
                    this.offers = recs;
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

    find(id) {
        return this.offers.find(offer => offer._id === id);
    }
}

module.exports = {
    OfferCache
};
