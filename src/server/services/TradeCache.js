'use strict';

const Trade = require('../../shared/businessobjects/Trade');

class TradeCache {
    constructor(db, users) {
        this.db = db;
        this.users = users;

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
                        resolve(newTrade);
                    }
                }).bind(this));
            }).bind(this);
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(trade)) {
                    db.update({_id: rec._id}, this.toPhysicalRecord(rec), {}, function(err, newRec) {
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
        rec.offers = trade.offers;
        
        rec.versionstamp = this.getNextVersionstamp();

        return rec;
    }

    toLogicalRecord(rec) {
        let trade = new Trade(null);
        trade._id = rec._id;

        trade.user1 = this.users.findById(rec.user1Id);
        trade.user2 = this.users.findById(rec.user2Id);

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
}

module.exports = TradeCache;