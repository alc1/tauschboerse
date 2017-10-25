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
        function initOffers() {
            return new Promise((resolve, reject) => {
                console.log('Loading offers...');
                dbOffers.find({}, (err, recs) => {
                    this.offers = recs;
                    console.log('offers loaded');
                    resolve(this);
                });
            });
        }

        function initOfferArticles() {
            return new Promise((resolve, reject) => {
                console.log('Loading offer articles...');
                dbOfferArticles.find({}, (err, recs) => {
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
                });
            });
        }

        return initOffers().then(() => initOfferArticles());
    }

    find(id) {
        return this.offers.find(offer => offer._id === id);
    }
}

module.exports = {
    OfferCache
};
