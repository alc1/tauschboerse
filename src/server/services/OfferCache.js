'use strict';

const Offer = require('../../shared/businessobjects/Offer');

class OfferCache {
    constructor(db, trades, articles, users) {
        this.db = db;
        this.trades = trades;
        this.articles = articles;
        this.users = users;

        this.offers = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading offers...');
            this.db.find({}, (function(err, recs) {
                if (err) {
                    reject(err);
                } else {
                    this.offers = recs.map(rec => this.toLogicalRecord(rec));
                    console.log('offers loaded');
                    resolve(this);
                }
            }).bind(this));
        };
                    
        return new Promise(load.bind(this));
    }

    clear() {
        let clearOp = (function(resolve, reject) {
            console.log('Clearing offers...');
            this.db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing offers: ' + err);
                    reject(err);
                } else {
                    console.log('Offers cleared');
                    this.offers = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        }).bind(this);

        let compactOp = (function(resolve, reject) {
            console.log('Compacting offers datafile...');
            this.db.on('compaction.done', () => {
                console.log('Offers datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        }).bind(this);

        return new Promise(clearOp).then(() => new Promise(compactOp));
    }

    save(offer) {
        let rec;
        let saveOp;

        if (offer.hasOwnProperty('_id')) {
            rec = this.find(offer._id);
        }

        if (!rec) {
            saveOp = function(resolve, reject) {
                this.db.insert(OfferCache.toPhysicalRecord(offer), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newOffer = this.toLogicalRecord(newRec);
                        this.offers.push(newOffer);
                        resolve(newOffer);
                    }
                }).bind(this));
            };
        } else {
            saveOp = function(resolve, reject) {
                if (rec.update(offer)) {
                    this.db.update({_id: rec._id}, OfferCache.toPhysicalRecord(rec), {}, function(err, newRec) {
                        resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            };
        }

        return new Promise(saveOp.bind(this));
    }

    delete(id) {
        let deleteOp = (function(resolve, reject) {
            let offer = this.find(id);
            if (offer) {
                this.offers.remove(offer);
                this.db.remove({ _id: offer._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }).bind(this);
        
        return new Promise(deleteOp);
    }

    prepare(obj, user) {
        return new Offer(obj);
    }

    static toPhysicalRecord(offer) {
        let rec = {};

        if (offer.hasOwnProperty('_id')) {
            rec._id = offer._id;
        }

        rec.tradeId = offer.trade._id;
        rec.senderId = offer.sender._id;
        rec.receiverId = offer.receiver._id;
        rec.articleIds = offer.articles.map(article => article._id);

        return rec;
    }

    toLogicalRecord(rec) {
        let offer = new Offer(null);
        offer._id = rec._id;

        offer.trade = this.trades.find(rec.tradeId);
        offer.sender = this.users.findById(rec.senderId);
        offer.receiver = this.users.findById(rec.receiverId);
        offer.articles = rec.articleIds ? rec.articleIds.map(id => this.articles.findById(id)) : [];
        
        return offer;
    }

    find(id) {
        return this.offers.find(offer => offer._id === id);
    }
}

module.exports = OfferCache;
