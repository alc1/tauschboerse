'use strict'

const Datastore = require('nedb');
const dbOffers = new Datastore({ filename : './data/offers.db', autoload : true });
const dbOfferArticles = new Datastore({ filename : './data/offerArticles.db', autoload : true });

export class OfferCache {
    constructor(articles) {
        this.articles = articles;

        this.offers = [];
    }

    init() {
        dbOffers.find({}, (err, recs) => {
            this.offers = recs;
        });

        dbOfferArticles.find({}, (err, recs) => {
            recs.forEach(rec => {
                let offer = this.find(rec.offerId);
                let article = this.articles.find(rec.articleId);

                if (!offer.articles) {
                    offer.articles = [];
                }
                offer.articles.push(article);
            });
        });
    }

    find(id) {
        return this.offers.find(offer => offer._id === id);
    }
}