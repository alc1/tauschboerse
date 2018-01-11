'use strict';

const Trade = require('../model/Trade');
const Offer = require('../model/Offer');

class TradeCache {
    constructor(db, users, articles) {
        this.db = db;
        this.users = users;
        this.articles = articles;

        this.trades = [];
        this.versionstamp = 0;
    }

    init() {
        let load = (function(resolve, reject) {
            console.log('Loading trades...');
            this.db.find({}, (function(err, recs) {
                if (err) {
                    console.log('error loading trades');
                    reject(err);
                } else {
                    this.trades = recs.map(rec => this.toLogicalRecord(rec));
                    this.versionstamp = recs.reduce((maxVersionstamp, trade) => trade.versionstamp > maxVersionstamp ? trade.versionstamp : maxVersionstamp, 0);
                    console.log(`trades loaded: ${this.trades.length} entries`);
                    resolve(recs);
                }
            }).bind(this));
        }).bind(this);
        
        return new Promise(load);
    }

    clear() {
        let clearOp = (function(resolve, reject) {
            console.log('Clearing trades...');
            this.db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing trades: ' + err);
                    reject(err);
                } else {
                    console.log('Trades cleared');
                    this.trades = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        }).bind(this);

        let compactOp = (function(resolve, reject) {
            console.log('Compacting trades datafile...');
            this.db.on('compaction.done', () => {
                console.log('Trades datafile compacted');
                resolve(null);
            });
            this.db.persistence.compactDatafile();
        }).bind(this);

        return new Promise(clearOp).then(() => new Promise(compactOp));
    }

    dump() {
        console.log('Trades:')
        console.log(JSON.stringify(this.trades, null, 2));
        console.log('');
    }

    save(trade) {
        let rec;
        let saveOp;

        if (trade.hasOwnProperty('_id')) {
            rec = this.find(trade._id);
        }

        if (!rec) {
            saveOp = (function(resolve, reject) {
                this.db.insert(this.toPhysicalRecord(trade), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newTrade = this.toLogicalRecord(newRec);
                        this.trades.push(newTrade);
                        trade._id = newTrade._id;
                        resolve(newTrade);
                    }
                }).bind(this));
            }).bind(this);
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(trade)) {
                    this.db.update({_id: rec._id}, this.toPhysicalRecord(rec), {}, function(err, newRec) {
                        resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            }).bind(this);
        }

        return new Promise(saveOp);
    }

    delete(id) {
        let deleteOp = (function(resolve, reject) {
            let trade = this.find(id);
            if (trade) {
                this.trades.remove(trade);
                this.db.remove({ _id: trade._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }).bind(this);
        
        return new Promise(deleteOp);
    }

    prepare(obj, user) {
        return new Trade(obj);
    }

    getNextVersionstamp() {
        return ++this.versionstamp;
    }

    toPhysicalRecord(trade) {
        let rec = {};

        if (trade.hasOwnProperty('_id')) {
            rec._id = trade._id;
        }

        rec.user1Id = trade.user1 ? trade.user1._id : null;
        rec.user2Id = trade.user2 ? trade.user2._id : null;
        rec.state = trade.state;
        rec.createDate = trade.createDate;
        rec.offers = trade.offers.map(offer => ({ senderId: offer.sender._id, createDate: offer.createDate, state: offer.state, articleIds: offer.articles.map(article => article._id) }));
        rec.user1HasDelivered = trade.user1HasDelivered;
        rec.user2HasDelivered = trade.user2HasDelivered;
        
        rec.versionstamp = this.getNextVersionstamp();

        return rec;
    }

    toLogicalOfferRecord(rec) {
        let offer = new Offer(null);

        offer.sender = this.users.findById(rec.senderId);

        offer.createDate = rec.createDate;
        offer.state = rec.state;

        offer.articles = rec.articleIds.map(id => this.articles.findById(id));

        return offer;
    }

    toLogicalRecord(rec) {
        let trade = new Trade(null);
        trade._id = rec._id;

        trade.user1 = this.users.findById(rec.user1Id);
        trade.user2 = this.users.findById(rec.user2Id);

        trade.state = rec.state;
        trade.createDate = rec.createDate;
        trade.user1HasDelivered = rec.user1HasDelivered;
        trade.user2HasDelivered = rec.user2HasDelivered;

        trade.offers = rec.offers.map(offer => this.toLogicalOfferRecord(offer));

        trade.versionstamp = rec.versionstamp;

        return trade;
    }

    findAll() {
        return this.trades.slice();
    }

    find(id) {
        return this.trades.find(item => item._id === id);
    }

    findByUserId(userId) {
        return this.trades.filter(t => (t.user1._id === userId) || (t.user2._id === userId));
    }

    findByArticleId(theArticleId, onlyInCurrentOffer) {
        return this.trades.filter(trade => onlyInCurrentOffer ? trade.hasCurrentRequestedOffer && trade.currentOffer.hasArticle(theArticleId) : trade.offers.some(offer => offer.hasArticle(theArticleId)));
    }

    isArticleUsed(theArticleId) {
        return this.trades.some(trade => trade.isArticleUsed(theArticleId));
    }
}

module.exports = TradeCache;